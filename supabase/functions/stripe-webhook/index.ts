// @ts-nocheck
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const CREDITS_PER_TIER: Record<string, number> = {
  Basic: 2500,
  Pro: 5000,
  Studio: 10000,
};

// Helper function to add credits with transaction logging
async function addCreditsWithLogging(
  userId: string,
  amount: number,
  transactionType: string,
  description: string,
  metadata: Record<string, any> = {}
) {
  // Get current balance
  const { data: currentData } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  const currentCredits = currentData?.credits || 0;
  const newBalance = currentCredits + amount;

  // Update user credits
  const { error: updateError } = await supabase
    .from("user_credits")
    .update({
      credits: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating credits:", updateError);
    return false;
  }

  // Log the transaction (using service role bypasses RLS)
  const { error: logError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount: amount,
      balance_after: newBalance,
      transaction_type: transactionType,
      description: description,
      metadata: metadata,
    });

  if (logError) {
    console.error("Error logging transaction:", logError);
  }

  console.log(`Added ${amount} credits to user ${userId}. New balance: ${newBalance}`);
  return true;
}

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET_KEY");

  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response("Webhook secret not configured", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log("Received Stripe event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const checkoutType = session.metadata?.type || "subscription";

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        // Handle credit top-up
        if (checkoutType === "topup") {
          const credits = parseInt(session.metadata?.credits || "0", 10);
          const packId = session.metadata?.packId;

          if (credits > 0) {
            await addCreditsWithLogging(
              userId,
              credits,
              "topup",
              `Credit top-up: ${credits.toLocaleString()} credits`,
              { packId, sessionId: session.id }
            );
            console.log("Top-up completed for user:", userId, "credits:", credits);
          }
          break;
        }

        // Handle subscription checkout
        const plan = session.metadata?.plan || "Basic";
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        console.log("Processing subscription checkout for user:", userId, "plan:", plan);

        // Get subscription details to check trial
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const isTrialing = subscription.status === "trialing";
        const trialEnd = subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null;

        const credits = CREDITS_PER_TIER[plan] || 2500;

        // Update user credits
        const { error } = await supabase
          .from("user_credits")
          .upsert({
            user_id: userId,
            credits: credits,
            subscription_status: isTrialing ? "trial" : "active",
            subscription_tier: plan,
            trial_end_date: trialEnd,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

        if (error) {
          console.error("Error updating user credits:", error);
        } else {
          // Log the subscription credit grant
          await supabase
            .from("credit_transactions")
            .insert({
              user_id: userId,
              amount: credits,
              balance_after: credits,
              transaction_type: "subscription",
              description: `${plan} plan subscription started`,
              metadata: { plan, subscriptionId, isTrialing },
            });

          console.log("Updated credits for user:", userId, "credits:", credits);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by stripe_customer_id
        const { data: userCredit } = await supabase
          .from("user_credits")
          .select("user_id, subscription_tier, credits")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!userCredit) {
          console.log("No user found for customer:", customerId);
          break;
        }

        const status = subscription.status;
        let subscriptionStatus = "none";

        if (status === "trialing") {
          subscriptionStatus = "trial";
        } else if (status === "active") {
          subscriptionStatus = "active";
        } else if (status === "canceled" || status === "unpaid") {
          subscriptionStatus = "cancelled";
        }

        // If subscription became active after trial, refresh credits
        if (status === "active") {
          const credits = CREDITS_PER_TIER[userCredit.subscription_tier] || 2500;
          await supabase
            .from("user_credits")
            .update({
              subscription_status: subscriptionStatus,
              credits: credits,
              trial_end_date: null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);
        } else {
          await supabase
            .from("user_credits")
            .update({
              subscription_status: subscriptionStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);
        }

        console.log("Updated subscription status for user:", userCredit.user_id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find and update user
        const { data: userCredit } = await supabase
          .from("user_credits")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (userCredit) {
          await supabase
            .from("user_credits")
            .update({
              subscription_status: "cancelled",
              credits: 0,
              subscription_tier: null,
              trial_end_date: null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);

          console.log("Subscription cancelled for user:", userCredit.user_id);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        // Skip if this is the first invoice (handled by checkout.session.completed)
        if (invoice.billing_reason === "subscription_create") {
          console.log("Skipping initial invoice - handled by checkout");
          break;
        }

        // Find user and refresh credits for new billing period
        const { data: userCredit } = await supabase
          .from("user_credits")
          .select("user_id, subscription_tier, credits")
          .eq("stripe_customer_id", customerId)
          .single();

        if (userCredit && userCredit.subscription_tier) {
          const newCredits = CREDITS_PER_TIER[userCredit.subscription_tier] || 2500;
          const newBalance = userCredit.credits + newCredits;

          await supabase
            .from("user_credits")
            .update({
              credits: newBalance,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);

          // Log the renewal
          await supabase
            .from("credit_transactions")
            .insert({
              user_id: userCredit.user_id,
              amount: newCredits,
              balance_after: newBalance,
              transaction_type: "subscription",
              description: `${userCredit.subscription_tier} plan renewal`,
              metadata: { invoiceId: invoice.id },
            });

          console.log("Refreshed credits for user:", userCredit.user_id);
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
