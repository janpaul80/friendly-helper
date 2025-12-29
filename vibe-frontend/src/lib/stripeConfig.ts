// Stripe pricing configuration for HeftCoder
// Generated from setup_stripe.ts

export const STRIPE_CONFIG = {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

    prices: {
        basic: {
            priceId: 'price_1SeUWAPW61ouIFFsTIZeMLjX',
            productId: 'prod_Tbhw7EOym0tziR',
            amount: 900, // $9.00
            trialDays: 7,
            name: 'Basic',
            credits: 10000,
            paymentLink: 'https://buy.stripe.com/cNi9AV6P78qudf52dW7kc03',
        },
        pro: {
            priceId: 'price_1SeUWBPW61ouIFFsGqF2zyFT',
            productId: 'prod_TbhwnOZakxNMP7',
            amount: 2500, // $25.00
            trialDays: 0,
            name: 'Pro',
            credits: 50000,
            paymentLink: 'https://buy.stripe.com/4gMfZj0qJ4ae7ULdWE7kc04',
        },
        studio: {
            priceId: 'price_1ShrgBPW61ouIFFs53PPLnK1',
            productId: 'prod_TfC4FQrzDt1LyZ',
            amount: 5900, // $59.00
            trialDays: 0,
            name: 'Studio',
            credits: 150000,
            paymentLink: 'https://buy.stripe.com/5kQaEZb5ngX05MDf0I7kc02',
        },
    },

    // Webhook endpoint (for backend)
    webhookEndpoint: '/api/payments/webhook',
};

// Helper to create checkout session
export async function createCheckoutSession(
    priceKey: 'basic' | 'pro' | 'studio',
    successUrl: string,
    cancelUrl: string
): Promise<{ url: string | null; error?: string }> {
    const config = STRIPE_CONFIG.prices[priceKey];

    if (!config) {
        return { url: null, error: 'Invalid price key' };
    }

    try {
        // For now, use Stripe payment links or redirect to Stripe directly
        // When backend is ready, this will call the checkout session API

        // If we have a payment link, use it
        if ('paymentLink' in config && config.paymentLink) {
            return { url: config.paymentLink };
        }

        // Otherwise, construct a basic checkout URL or call backend
        // This is a placeholder until backend is ready
        const response = await fetch('/api/payments/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: config.priceId,
                successUrl,
                cancelUrl,
                trialDays: config.trialDays,
            }),
        });

        const data = await response.json();
        return { url: data.url };
    } catch (error: any) {
        console.error('Checkout error:', error);
        // Fallback: redirect to Stripe directly
        return {
            url: null,
            error: 'Checkout temporarily unavailable. Please try again later.'
        };
    }
}

export default STRIPE_CONFIG;
