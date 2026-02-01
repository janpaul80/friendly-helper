import { Link } from "react-router-dom";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import { Header } from "../components/marketing/Header";
import { Footer } from "../components/marketing/Footer";
import { SEO, schemas } from "../components/SEO";

const plans = [
  {
    name: "Basic",
    price: "$9",
    period: "/month",
    description: "Perfect for hobbyists and side projects",
    credits: "2,500 credits/month",
    features: [
      "AI code generation",
      "Live preview",
      "Basic templates",
      "Community support",
      "1 project",
    ],
    cta: "Start Free Trial",
    popular: false,
    icon: Zap,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professional developers and startups",
    credits: "10,000 credits/month",
    features: [
      "Everything in Basic",
      "Priority AI processing",
      "Advanced templates",
      "GitHub integration",
      "Custom domains",
      "Email support",
      "10 projects",
    ],
    cta: "Get Started",
    popular: true,
    icon: Rocket,
  },
  {
    name: "Studio",
    price: "$99",
    period: "/month",
    description: "For teams and agencies building at scale",
    credits: "50,000 credits/month",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "White-label exports",
      "API access",
      "Priority support",
      "Custom integrations",
      "Unlimited projects",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: Building2,
  },
];

// Structured data for pricing
const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "HeftCoder",
  description: "AI-powered code generation platform for building production-ready applications",
  brand: {
    "@type": "Brand",
    name: "HeftCoder",
  },
  offers: plans.map((plan) => ({
    "@type": "Offer",
    name: `HeftCoder ${plan.name}`,
    description: plan.description,
    price: plan.price.replace("$", ""),
    priceCurrency: "USD",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    url: "https://app.heftcoder.icu/pricing",
  })),
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="Pricing - Plans for Every Developer"
        description="Choose the perfect HeftCoder plan. Basic at $9/mo with 10,000 credits, Pro at $25/mo with 50,000 credits, or Studio at $59/mo with 150,000 credits. Start with a 3-day free trial."
        keywords="HeftCoder pricing, AI code generation pricing, developer tools pricing, software development plans"
        url="/pricing"
        schema={pricingSchema}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent <span className="text-orange-500">Pricing</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Start building for free. Upgrade when you need more power. All plans include a 3-day free trial.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-b from-orange-600/20 to-orange-600/5 border-2 border-orange-500"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    plan.popular ? "bg-orange-600" : "bg-white/10"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                </div>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-orange-400 font-medium mb-4">{plan.credits}</p>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-2">What are credits?</h3>
              <p className="text-gray-400 text-sm">
                Credits are used for AI-powered code generation. Each prompt or generation uses credits based on complexity. Basic tasks use fewer credits, while complex multi-file generations use more.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">
                Yes! All plans are month-to-month with no long-term commitment. Cancel anytime from your dashboard. You'll retain access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-2">What happens if I run out of credits?</h3>
              <p className="text-gray-400 text-sm">
                You can purchase additional credit packs or upgrade your plan. Your projects remain accessible, but AI generation pauses until credits are added.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-bold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-400 text-sm">
                We offer a 3-day free trial on all plans. If you're not satisfied within the first 14 days of a paid subscription, contact support for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
