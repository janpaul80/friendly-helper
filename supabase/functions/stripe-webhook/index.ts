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

// Credit allocations per subscription tier
const CREDITS_PER_TIER: Record<string, number> = {
  Basic: 10000,   // $9/mo = 10,000 credits
  Pro: 50000,     // $25/mo = 50,000 credits
  Studio: 150000, // $59/mo = 150,000 credits
};

// Trial credits
const TRIAL_CREDITS = 2500;

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

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

          if (credits > 0) {
            // Get current balance
            const { data: currentData } = await supabase
              .from("user_credits")
              .select("credits, credits_spent")
              .eq("user_id", userId)
              .maybeSingle();

            const currentCredits = currentData?.credits || 0;
            const newBalance = currentCredits + credits;

            await supabase
              .from("user_credits")
              .upsert({
                user_id: userId,
                credits: newBalance,
                credits_spent: currentData?.credits_spent || 0,
                updated_at: new Date().toISOString(),
              }, { onConflict: "user_id" });

            console.log("Top-up completed for user:", userId, "added credits:", credits);
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

        // Trial = 2,500 credits, Active = full tier credits
        const credits = isTrialing ? TRIAL_CREDITS : (CREDITS_PER_TIER[plan] || 10000);

        // Update user credits
        const { error } = await supabase
          .from("user_credits")
          .upsert({
            user_id: userId,
            credits: credits,
            credits_spent: 0,
            subscription_status: isTrialing ? "trial" : "active",
            subscription_tier: plan.toLowerCase(),
            trial_end_date: trialEnd,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            current_period_start: subscription.current_period_start 
              ? new Date(subscription.current_period_start * 1000).toISOString() 
              : null,
            current_period_end: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000).toISOString() 
              : null,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

        if (error) {
          console.error("Error updating user credits:", error);
        } else {
          console.log("Updated credits for user:", userId, "credits:", credits, "plan:", plan);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by stripe_customer_id
        const { data: userCredit } = await supabase
          .from("user_credits")
          .select("user_id, subscription_tier, credits, subscription_status")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

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

        // If subscription became active after trial, grant full credits
        if (status === "active" && userCredit.subscription_status === "trial") {
          const tier = userCredit.subscription_tier?.charAt(0).toUpperCase() + 
                      userCredit.subscription_tier?.slice(1) || "Basic";
          const credits = CREDITS_PER_TIER[tier] || 10000;
          
          await supabase
            .from("user_credits")
            .update({
              subscription_status: subscriptionStatus,
              credits: credits,
              credits_spent: 0,
              trial_end_date: null,
              current_period_start: subscription.current_period_start 
                ? new Date(subscription.current_period_start * 1000).toISOString() 
                : null,
              current_period_end: subscription.current_period_end 
                ? new Date(subscription.current_period_end * 1000).toISOString() 
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);
            
          console.log("Trial ended, granted full credits:", credits, "for user:", userCredit.user_id);
        } else {
          await supabase
            .from("user_credits")
            .update({
              subscription_status: subscriptionStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);
        }

        console.log("Updated subscription status for user:", userCredit.user_id, "status:", subscriptionStatus);
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
          .maybeSingle();

        if (userCredit) {
          await supabase
            .from("user_credits")
            .update({
              subscription_status: "cancelled",
              credits: 0,
              subscription_tier: "free",
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
          .select("user_id, subscription_tier")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (userCredit && userCredit.subscription_tier) {
          const tier = userCredit.subscription_tier.charAt(0).toUpperCase() + 
                      userCredit.subscription_tier.slice(1);
          const newCredits = CREDITS_PER_TIER[tier] || 10000;

          await supabase
            .from("user_credits")
            .update({
              credits: newCredits,
              credits_spent: 0,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);

          console.log("Renewed credits for user:", userCredit.user_id, "credits:", newCredits);
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
