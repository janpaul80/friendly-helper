import { useState } from 'react';
import { Server, Users, Gift, Copy, Check, ExternalLink, Database, Cloud, Shield } from 'lucide-react';

interface DeveloperUtilitiesProps {
  userId: string;
  referralCode?: string;
}

export function DeveloperUtilities({ userId, referralCode }: DeveloperUtilitiesProps) {
  const [copied, setCopied] = useState(false);
  
  const generatedReferralCode = referralCode || `HEFT-${userId.slice(0, 6).toUpperCase()}`;
  const referralLink = `https://heftcoder.icu/signup?ref=${generatedReferralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const backendServices = [
    { name: 'Database', status: 'connected', icon: Database, color: 'emerald' },
    { name: 'Auth', status: 'active', icon: Shield, color: 'blue' },
    { name: 'Storage', status: 'ready', icon: Cloud, color: 'purple' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Backend Status */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Backend Status</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Infrastructure health</p>
          </div>
        </div>

        <div className="space-y-3">
          {backendServices.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-[#111118] rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <service.icon size={16} className={`text-${service.color}-500`} />
                <span className="text-sm font-medium text-white">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full bg-${service.color}-500 animate-pulse`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider text-${service.color}-400`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 bg-[#111118] hover:bg-[#161620] border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2">
          <ExternalLink size={12} />
          View Full Dashboard
        </button>
      </div>

      {/* Referral System */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-500">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Invite & Earn</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Get 500 credits per paid signup</p>
          </div>
        </div>

        <div className="bg-[#111118] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Referral Link</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-[#0a0a0f] border border-white/5 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-400 outline-none focus:border-orange-500/30"
            />
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-lg transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-orange-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-black">
              500
            </div>
            <div>
              <p className="text-sm font-bold text-white">Earn 500 HeftCredits</p>
              <p className="text-[10px] text-gray-400">For each friend who subscribes & publishes</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500">
          <span>Referrals this month: <span className="text-white font-bold">0</span></span>
          <span>Earnings: <span className="text-orange-400 font-bold">0 credits</span></span>
        </div>
      </div>
    </div>
  );
}
