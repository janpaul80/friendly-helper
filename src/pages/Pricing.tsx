import { useState } from "react";

import { Check, Zap, Command, Crown, ChevronRight, Loader2 } from "lucide-react";
import { Header } from "../components/marketing/Header";
import { Footer } from "../components/marketing/Footer";
import { SEO } from "../components/SEO";
import { toast } from "sonner";
import { openExternalUrl, preopenExternalWindow } from "../lib/openExternal";
import { supabase } from "../lib/supabase";
import { useClerkUser } from "../hooks/useClerkUser";

interface FeatureGroup {
  category: string;
  features: string[];
}

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  period: string;
  credits: string;
  identity: string;
  featureGroups: FeatureGroup[];
  cta: string;
  popular: boolean;
  icon: typeof Zap;
  gradient?: string;
  stripePlan: string; // Plan name for Stripe checkout
  trialDays?: number; // Optional trial period
}

const plans: PricingTier[] = [
  {
    name: "Solo Builder",
    tagline: "Mode",
    price: "$9",
    period: "/month",
    credits: "10,000 HeftCredits",
    identity: "From prompt to real prototype in minutes.",
    featureGroups: [
      {
        category: "Orchestration Power",
        features: [
          "Single-flow orchestration",
          "1 main agent + limited helpers",
          "Safe execution mode",
        ],
      },
      {
        category: "Agent Intelligence",
        features: [
          "Guided agent prompts",
          "Pre-wired system prompts",
          "GPT-5.1 base model access",
        ],
      },
      {
        category: "Workspace Control",
        features: [
          "Short-term workspace memory",
          "One-click app scaffolds",
          "Public workspaces",
        ],
      },
      {
        category: "Support",
        features: [
          "Community support",
          "3-day free trial",
        ],
      },
    ],
    cta: "Start Building",
    popular: false,
    icon: Zap,
    stripePlan: "Basic",
    trialDays: 3,
  },
  {
    name: "Operator",
    tagline: "Mode",
    price: "$25",
    period: "/month",
    credits: "50,000 HeftCredits",
    identity: "You're operating systems, not chatting with AI.",
    featureGroups: [
      {
        category: "Orchestration Power",
        features: [
          "Visual multi-agent orchestration",
          "Planner → Builder → Reviewer → Fixer",
          "Parallel agent execution",
          "Replay & fork previous runs",
        ],
      },
      {
        category: "Agent Intelligence",
        features: [
          "Smart model routing",
          "Live refactor mode",
          "High-power models",
          "Flux.2 PRO image generation",
        ],
      },
      {
        category: "Workspace Control",
        features: [
          "Persistent long-term memory",
          "Private workspaces",
          "Custom domains",
          "Remove HeftCoder branding",
        ],
      },
      {
        category: "Execution & Compute",
        features: [
          "Workspace usage insights",
          "Cost tracking dashboard",
        ],
      },
    ],
    cta: "Become an Operator",
    popular: true,
    icon: Command,
    gradient: "from-orange-600/30 via-orange-500/10 to-transparent",
    stripePlan: "Pro",
  },
  {
    name: "Command Center",
    tagline: "Mode",
    price: "$59",
    period: "/month",
    credits: "150,000 HeftCredits",
    identity: "You're not using AI. You're commanding it.",
    featureGroups: [
      {
        category: "Orchestration Power",
        features: [
          "Unlimited agent graphs & workflows",
          "Custom agent roles (Architect, QA, DevOps, Security)",
          "Long-running autonomous tasks",
          "Agents work while you're offline",
        ],
      },
      {
        category: "Agent Intelligence",
        features: [
          "Global memory across workspaces",
          "Highest-context models",
          "System prompt locking",
          "Early access to experimental agents",
        ],
      },
      {
        category: "Workspace Control",
        features: [
          "Team workspaces",
          "Role-based access control",
          "Audit logs for agent actions",
          "Custom integrations & API",
        ],
      },
      {
        category: "Execution & Compute",
        features: [
          "Priority compute queues",
          "Best models available",
        ],
      },
      {
        category: "Support & Privileges",
        features: [
          "Concierge onboarding",
          "White-glove setup",
          "Priority support",
        ],
      },
    ],
    cta: "Take Command",
    popular: false,
    icon: Crown,
    stripePlan: "Studio",
  },
];

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "HeftCoder",
  description: "AI orchestrator workspace for building production-ready applications with multi-agent systems",
  brand: {
    "@type": "Brand",
    name: "HeftCoder",
  },
  offers: plans.map((plan) => ({
    "@type": "Offer",
    name: `HeftCoder ${plan.name}`,
    description: plan.identity,
    price: plan.price.replace("$", ""),
    priceCurrency: "USD",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    url: "https://app.heftcoder.icu/pricing",
  })),
};

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useClerkUser();

  const handleUpgrade = async (plan: string) => {
    setLoadingPlan(plan);
    const checkoutWindow = preopenExternalWindow();
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { 
          plan,
          clerkUserId: user?.id,
          clerkUserEmail: user?.email,
        },
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        toast.error("Failed to create checkout session. Please try again.");
        return;
      }
      
      if (data?.url) {
        openExternalUrl(data.url, checkoutWindow);
      } else if (data?.error) {
        toast.error(data.error || "An error occurred. Please try again.");
      } else {
        toast.error("Failed to get checkout URL. Please try again.");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="Pricing - Power, Control, Outcomes"
        description="Choose your command level. Solo Builder for rapid prototypes, Operator for multi-agent orchestration, or Command Center for elite autonomous systems."
        keywords="HeftCoder pricing, AI orchestrator, multi-agent systems, AI workspace, autonomous AI agents"
        url="/pricing"
        schema={pricingSchema}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
          <Command className="w-4 h-4" />
          AI Orchestration Tiers
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Choose Your <span className="text-orange-500">Command Level</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          This isn't about credits. It's about leverage, control, and what you can build.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? `bg-gradient-to-b ${plan.gradient} border-2 border-orange-500`
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.popular ? "bg-orange-600" : "bg-white/10"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{plan.name}</h2>
                      <span className="text-sm text-gray-500 uppercase tracking-wider">{plan.tagline}</span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.trialDays && (
                      <span className="text-orange-500 text-sm font-medium mr-2">{plan.trialDays}-day free trial, then</span>
                    )}
                    <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-orange-400/80 font-medium">{plan.credits}</p>
                </div>

                {/* Identity Statement */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-sm text-gray-300 italic">"{plan.identity}"</p>
                </div>

                {/* Feature Groups */}
                <div className="flex-1 space-y-5 mb-8">
                  {plan.featureGroups.map((group) => (
                    <div key={group.category}>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {group.category}
                      </h4>
                      <ul className="space-y-2">
                        {group.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                              plan.popular ? "text-orange-500" : "text-green-500"
                            }`} />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleUpgrade(plan.stripePlan)}
                  disabled={loadingPlan === plan.stripePlan}
                  className={`group flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 ${
                    plan.popular
                      ? "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/25"
                      : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                  }`}
                >
                  {loadingPlan === plan.stripePlan ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {plan.cta}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Questions?</h2>
          <p className="text-center text-gray-500 mb-12">Everything you need to know about commanding AI.</p>
          <div className="space-y-4">
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="font-bold mb-2">What's the difference between tiers?</h3>
              <p className="text-gray-400 text-sm">
                It's not about more credits—it's about more control. Solo Builder gives you fast prototyping. Operator lets you run multi-agent systems. Command Center gives you autonomous agents that work while you sleep.
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="font-bold mb-2">Can I switch tiers anytime?</h3>
              <p className="text-gray-400 text-sm">
                Yes. Upgrade instantly, downgrade at the end of your billing cycle. Your workspaces and memory persist—you just gain or lose command capabilities.
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="font-bold mb-2">What happens when I run out of credits?</h3>
              <p className="text-gray-400 text-sm">
                Your agents pause. Your workspaces stay intact. Add credits or upgrade your tier to resume. No data loss, no panic.
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-400 text-sm">
                All tiers include a 3-day free trial. Experience the full power before committing. Not satisfied within 14 days? Full refund, no questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
