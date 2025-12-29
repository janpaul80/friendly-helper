import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

export async function POST(req: any) {
    try {
        const { plan, userId, userEmail } = await req.json();

        const prices: Record<string, string> = {
            "Basic": process.env.STRIPE_PRICE_BASIC_ID!,
            "Pro": process.env.STRIPE_PRICE_PRO_ID!,
            "Studio": process.env.STRIPE_PRICE_STUDIO_ID!,
        };

        if (!prices[plan]) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: prices[plan],
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${req.headers.get("origin")}/dashboard?success=true`,
            cancel_url: `${req.headers.get("origin")}/?canceled=true`,
            metadata: {
                userId: userId,
                plan: plan,
            },
            customer_email: userEmail,
            subscription_data: plan === "Basic" ? {
                trial_period_days: 7
            } : undefined,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
