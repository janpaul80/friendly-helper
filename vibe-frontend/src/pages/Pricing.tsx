import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, Check, X, Sparkles, Rocket, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STRIPE_CONFIG } from '../lib/stripeConfig';

export default function Pricing() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });
    }, []);

    const handleSubscribe = async (tier: any) => {
        try {
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            if (!supabaseUser) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/payment/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: tier.priceId,
                    userId: supabaseUser.id,
                    successUrl: window.location.origin + '/dashboard?upgrade=success',
                    cancelUrl: window.location.origin + '/pricing',
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            alert('Failed to start checkout. Please try again.');
        }
    };

    const tiers = [
        {
            name: 'Basic',
            price: '$9',
            period: '/month',
            color: 'green',
            icon: Sparkles,
            tagline: 'For builders, learners, and light projects',
            credits: '10,000 HeftCredits / month',
            trial: "7 days free (2,500 credits)",
            priceId: STRIPE_CONFIG.prices.basic.priceId,
            paymentLink: STRIPE_CONFIG.prices.basic.paymentLink,
            features: [
                'Access to GPT-5.1 (Orchestrator Mode)',
                'Single-agent coding',
                'Short-context code generation',
                'Prompt-to-code workflows',
                'Chat-based coding & debugging',
                'Public project workspace',
                'Standard response speed',
            ],
            limits: [
                'No multi-agent orchestration',
                'No Claude / advanced reasoning models',
                'No long-running tasks',
                'No background jobs',
                'No private repositories',
            ],
            bestFor: 'Students, solo devs, MVP experiments, learning HeftCoder',
        },
        {
            name: 'Pro',
            price: '$25',
            period: '/month',
            color: 'blue',
            icon: Rocket,
            tagline: 'For serious developers shipping real products',
            credits: '50,000 HeftCredits / month',
            popular: true,
            priceId: STRIPE_CONFIG.prices.pro.priceId,
            paymentLink: STRIPE_CONFIG.prices.pro.paymentLink,
            features: [
                'Multi-agent VIBE coding',
                '→ Planner Agent',
                '→ Coder Agent',
                '→ Reviewer Agent',
                'GPT-5.1 (Orchestrator)',
                'GPT-5.1-Codex-Mini (Coding Agent)',
                'Long-context reasoning',
                'Iterative code refinement',
                'Private workspaces',
                'Git-style project memory',
                'Faster response priority',
                'Streaming outputs',
            ],
            limits: [
                'Claude models not included',
                'No enterprise-grade workflows',
                'Limited background task concurrency',
            ],
            bestFor: 'Indie hackers, freelancers, startups, SaaS builders',
        },
        {
            name: 'Studio',
            price: '$59',
            period: '/month',
            color: 'purple',
            icon: Crown,
            tagline: 'For power users, teams, and AI-first development',
            credits: '150,000 HeftCredits / month',
            flagship: true,
            priceId: STRIPE_CONFIG.prices.studio.priceId,
            paymentLink: STRIPE_CONFIG.prices.studio.paymentLink,
            features: [
                'Full VIBE multi-agent orchestration',
                '→ Planner Agent',
                '→ Coder Agent',
                '→ Reviewer Agent',
                '→ Optimizer / Refactor Agent',
                'ALL core models included:',
                '→ GPT-5.1 (Primary Orchestrator)',
                '→ GPT-5.1-Codex-Mini (High-performance)',
                '→ Claude 4.5 Opus (Advanced reasoning)',
                'Smart model routing (auto-selects best)',
                'Long-running background jobs',
                'Large-context codebases',
                'Private + team workspaces',
                'Priority compute & fastest responses',
                'Advanced error analysis & refactoring',
                'Early access to new models & features',
            ],
            limits: [
                'Fair-use policy applies',
                'Credits required for long background jobs',
            ],
            bestFor: 'Startups, agencies, AI power users, teams shipping production software',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-black font-bold">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl">HeftCoder</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Choose Your Plan</h1>
                <p className="text-xl text-gray-400 text-center mb-4">AI-powered coding with transparent, predictable pricing</p>
                <p className="text-sm text-gray-500 text-center mb-12">HeftCredits reset monthly • No surprise overages • Upgrade anytime</p>

                <div className="grid lg:grid-cols-3 gap-6 mb-16">
                    {tiers.map((tier) => {
                        const Icon = tier.icon;
                        const borderColor = tier.popular
                            ? 'border-blue-500/50'
                            : tier.flagship
                                ? 'border-purple-500/50'
                                : 'border-white/10';
                        const bgGradient = tier.popular
                            ? 'bg-gradient-to-b from-blue-900/20 to-[#0f0f18]'
                            : tier.flagship
                                ? 'bg-gradient-to-b from-purple-900/20 to-[#0f0f18]'
                                : 'bg-[#121212]';

                        return (
                            <div
                                key={tier.name}
                                className={`p-6 rounded-2xl border ${borderColor} ${bgGradient} relative`}
                            >
                                {tier.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                                        MOST POPULAR
                                    </span>
                                )}
                                {tier.flagship && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
                                        FLAGSHIP
                                    </span>
                                )}
                                {tier.trial && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white bg-green-600 rounded-full">
                                        🎁 7 DAYS FREE
                                    </span>
                                )}

                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tier.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                        tier.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                                </div>

                                <p className="text-gray-400 text-sm mb-4">{tier.tagline}</p>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    <span className="text-gray-500">{tier.period}</span>
                                </div>

                                <p className={`text-sm font-medium mb-6 ${tier.color === 'green' ? 'text-green-400' :
                                    tier.color === 'blue' ? 'text-blue-400' :
                                        'text-purple-400'
                                    }`}>
                                    {tier.credits.replace('HeftCredits', 'HeftCredits')}
                                </p>

                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">What you get</h4>
                                    <ul className="space-y-2">
                                        {tier.features.map((f) => (
                                            <li key={f} className={`flex items-start gap-2 text-sm ${f.startsWith('→') ? 'pl-4 text-gray-400' : 'text-gray-300'}`}>
                                                {!f.startsWith('→') && <Check size={16} className="text-green-500 mt-0.5 shrink-0" />}
                                                {f.startsWith('→') ? f.slice(2) : f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Limits</h4>
                                    <ul className="space-y-2">
                                        {tier.limits.map((l) => (
                                            <li key={l} className="flex items-start gap-2 text-sm text-gray-500">
                                                <X size={14} className="text-gray-600 mt-0.5 shrink-0" />
                                                {l}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Best for</h4>
                                    <p className="text-sm text-gray-400">{tier.bestFor}</p>
                                </div>

                                {isLoggedIn ? (
                                    <button
                                        onClick={() => handleSubscribe(tier)}
                                        className={`w-full text-center py-3 rounded-lg font-semibold transition-all ${tier.popular
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : tier.flagship
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                : 'bg-white/10 hover:bg-white/20 text-white'
                                            }`}
                                    >
                                        Upgrade Now
                                    </button>
                                ) : (
                                    <Link
                                        to="/login?mode=signup"
                                        className={`block text-center py-3 rounded-lg font-semibold transition-all ${tier.popular
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : tier.flagship
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                : 'bg-white/10 hover:bg-white/20 text-white'
                                            }`}
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Credits Explainer */}
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">🧮 How Credits Work</h2>
                    <p className="text-gray-400 text-center mb-6">1 HeftCredit ≈ small chunk of model compute</p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-gray-300">Short chat response</p>
                            <p className="text-lg font-semibold text-orange-400">10–25 credits</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-gray-300">Code generation task</p>
                            <p className="text-lg font-semibold text-orange-400">50–150 credits</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-gray-300">Multi-agent workflow</p>
                            <p className="text-lg font-semibold text-orange-400">200–800 credits</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-gray-300">Large refactor / architecture review</p>
                            <p className="text-lg font-semibold text-orange-400">1,000+ credits</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span>✓ Credits reset monthly</span>
                        <span>✓ No surprise overages</span>
                        <span>✓ Upgrade anytime</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
