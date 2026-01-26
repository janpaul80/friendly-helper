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
        const plan = session.metadata?.plan || "Basic";
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        console.log("Processing checkout for user:", userId, "plan:", plan);

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
          .select("user_id, subscription_tier")
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

        // Find user and refresh credits for new billing period
        const { data: userCredit } = await supabase
          .from("user_credits")
          .select("user_id, subscription_tier")
          .eq("stripe_customer_id", customerId)
          .single();

        if (userCredit && userCredit.subscription_tier) {
          const credits = CREDITS_PER_TIER[userCredit.subscription_tier] || 2500;
          await supabase
            .from("user_credits")
            .update({
              credits: credits,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userCredit.user_id);

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
