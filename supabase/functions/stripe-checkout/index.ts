// @ts-nocheck
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Initialize Supabase client to verify auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    
    // Create Supabase client with the user's token if provided
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Try to get the authenticated user
    let authenticatedUserId: string | null = null;
    let authenticatedUserEmail: string | null = null;
    
    if (authHeader) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!authError && user) {
        authenticatedUserId = user.id;
        authenticatedUserEmail = user.email || null;
        console.log("Authenticated user:", authenticatedUserId);
      }
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { plan } = await req.json();
    console.log("Checkout request:", { plan, authenticatedUserId });

    // Validate plan input
    const validPlans = ["Basic", "Pro", "Studio"];
    const normalizedPlan = plan?.charAt(0).toUpperCase() + plan?.slice(1).toLowerCase();
    
    if (!normalizedPlan || !validPlans.includes(normalizedPlan)) {
      console.error("Invalid plan:", plan);
      return new Response(JSON.stringify({ error: "Invalid plan specified" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prices: Record<string, string | undefined> = {
      Basic: Deno.env.get("STRIPE_PRICE_BASIC_ID"),
      Pro: Deno.env.get("STRIPE_PRICE_PRO_ID"),
      Studio: Deno.env.get("STRIPE_PRICE_STUDIO_ID"),
    };

    const priceId = prices[normalizedPlan];
    if (!priceId) {
      console.error("Missing price ID for plan:", normalizedPlan);
      return new Response(JSON.stringify({ error: `Price not configured for plan: ${normalizedPlan}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "https://heftcoder.lovable.app";
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
        // Use server-derived userId, not client-provided
        userId: authenticatedUserId || "",
        plan: normalizedPlan,
      },
    };

    // Use authenticated email if available
    if (authenticatedUserEmail) {
      sessionParams.customer_email = authenticatedUserEmail;
    }

    if (normalizedPlan === "Basic") {
      sessionParams.subscription_data = { trial_period_days: 7 };
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
