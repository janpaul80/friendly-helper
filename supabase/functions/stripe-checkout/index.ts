// @ts-nocheck
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Credit pack configurations
const CREDIT_PACKS: Record<string, { credits: number; priceInCents: number }> = {
  topup_2500: { credits: 2500, priceInCents: 900 },
  topup_10000: { credits: 10000, priceInCents: 2900 },
  topup_50000: { credits: 50000, priceInCents: 9900 },
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.json();
    const { plan, topup, clerkUserId, clerkUserEmail } = body;
    
    // Use Clerk user info from request body (Clerk doesn't use Supabase auth)
    const userId = clerkUserEmail || clerkUserId || null; // Use email as primary identifier
    const userEmail = clerkUserEmail || null;
    
    console.log("Checkout request:", { plan, topup, userId, userEmail });

    const origin = req.headers.get("origin") || "https://heftcoder.lovable.app";

    // Handle credit top-up purchases
    if (topup) {
      const pack = CREDIT_PACKS[topup];
      if (!pack) {
        return new Response(JSON.stringify({ error: "Invalid top-up pack" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!userId) {
        return new Response(JSON.stringify({ error: "Authentication required for top-up" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${pack.credits.toLocaleString()} HeftCredits`,
                description: "One-time credit top-up",
              },
              unit_amount: pack.priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/dashboard?topup=success&credits=${pack.credits}`,
        cancel_url: `${origin}/dashboard?topup=canceled`,
        customer_email: userEmail || undefined,
        metadata: {
          type: "topup",
          userId: userId,
          credits: pack.credits.toString(),
          packId: topup,
        },
      });

      console.log("Top-up checkout session created:", session.id);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle subscription plans (existing logic)
    const validPlans = ["Basic", "Pro", "Studio"];
    const normalizedPlan = plan?.charAt(0).toUpperCase() + plan?.slice(1).toLowerCase();
    
    if (!normalizedPlan || !validPlans.includes(normalizedPlan)) {
      console.error("Invalid plan:", plan);
      return new Response(JSON.stringify({ error: "Invalid plan specified" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

// Price IDs for subscription tiers
// Basic: $9/mo = 10,000 credits
// Pro: $25/mo = 50,000 credits  
// Studio: $59/mo = 150,000 credits
// Strip any leading "=" from price IDs (in case they were saved incorrectly)
const cleanPriceId = (id: string | undefined): string | undefined => {
  if (!id) return undefined;
  return id.startsWith("=") ? id.slice(1) : id;
};

const prices: Record<string, string | undefined> = {
  Basic: cleanPriceId(Deno.env.get("STRIPE_PRICE_BASIC_ID")),
  Pro: cleanPriceId(Deno.env.get("STRIPE_PRICE_PRO_ID")),
  Studio: cleanPriceId(Deno.env.get("STRIPE_PRICE_STUDIO_ID")),
};

    const priceId = prices[normalizedPlan];
    if (!priceId) {
      console.error("Missing price ID for plan:", normalizedPlan);
      return new Response(JSON.stringify({ error: `Price not configured for plan: ${normalizedPlan}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Creating checkout session with origin:", origin);

    const sessionParams: any = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        type: "subscription",
        userId: userId || "",
        plan: normalizedPlan,
      },
    };

    // Use email if available
    if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    if (normalizedPlan === "Basic") {
      sessionParams.subscription_data = { trial_period_days: 3 };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe Checkout Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
