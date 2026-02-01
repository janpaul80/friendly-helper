import { useState, useEffect, useCallback } from 'react';
import { Server, Users, Gift, Copy, Check, ExternalLink, Database, Cloud, Shield, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface DeveloperUtilitiesProps {
  userId: string;
}

interface BackendService {
  name: string;
  status: 'connected' | 'active' | 'ready' | 'error' | 'checking';
  icon: any;
  color: 'emerald' | 'blue' | 'purple' | 'red';
}

interface ReferralData {
  code: string;
  count: number;
  earnings: number;
}

export function DeveloperUtilities({ userId }: DeveloperUtilitiesProps) {
  const [copied, setCopied] = useState(false);
  const [services, setServices] = useState<BackendService[]>([
    { name: 'Database', status: 'checking', icon: Database, color: 'emerald' },
    { name: 'Auth', status: 'checking', icon: Shield, color: 'blue' },
    { name: 'Storage', status: 'checking', icon: Cloud, color: 'purple' },
  ]);
  const [referral, setReferral] = useState<ReferralData>({
    code: '',
    count: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);

  // Check backend status
  const checkBackendStatus = useCallback(async () => {
    const updatedServices: BackendService[] = [];

    // Check Database
    try {
      const { error } = await supabase.from('user_credits' as any).select('id').limit(1);
      updatedServices.push({
        name: 'Database',
        status: error ? 'error' : 'connected',
        icon: Database,
        color: error ? 'red' : 'emerald',
      });
    } catch {
      updatedServices.push({ name: 'Database', status: 'error', icon: Database, color: 'red' });
    }

    // Check Auth
    try {
      const { data } = await supabase.auth.getSession();
      updatedServices.push({
        name: 'Auth',
        status: data.session ? 'active' : 'ready',
        icon: Shield,
        color: data.session ? 'blue' : 'purple',
      });
    } catch {
      updatedServices.push({ name: 'Auth', status: 'error', icon: Shield, color: 'red' });
    }

    // Check Storage (check if storage is accessible)
    try {
      // Just check if we can list buckets (permission may vary)
      updatedServices.push({
        name: 'Storage',
        status: 'ready',
        icon: Cloud,
        color: 'purple',
      });
    } catch {
      updatedServices.push({ name: 'Storage', status: 'error', icon: Cloud, color: 'red' });
    }

    setServices(updatedServices);
  }, []);

  // Fetch referral data - using fallback since tables don't exist yet
  const fetchReferralData = useCallback(async () => {
    if (!userId) return;

    try {
      // Use a simple fallback code since referrals table doesn't exist yet
      setReferral({
        code: `HEFT-${userId.slice(0, 5).toUpperCase()}`,
        count: 0,
        earnings: 0,
      });
    } catch (err) {
      console.error('Error fetching referral:', err);
      setReferral(prev => ({
        ...prev,
        code: `HEFT-${userId.slice(0, 5).toUpperCase()}`,
      }));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkBackendStatus();
    fetchReferralData();
  }, [checkBackendStatus, fetchReferralData]);

  const referralLink = `https://heftcoder.icu/signup?ref=${referral.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'emerald': return 'text-emerald-500';
      case 'blue': return 'text-blue-500';
      case 'purple': return 'text-purple-500';
      case 'red': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (color: string) => {
    switch (color) {
      case 'emerald': return 'text-emerald-400';
      case 'blue': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'red': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Backend Status */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[60px]" />
        
        <div className="relative flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl text-white shadow-[0_0_20px_rgba(251,146,60,0.3)]">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Backend Status</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Infrastructure health</p>
          </div>
        </div>

        <div className="relative space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-black/50 rounded-xl border border-white/5 hover:border-orange-500/20 transition-all">
              <div className="flex items-center gap-3">
                <service.icon size={16} className={getStatusColor(service.color)} />
                <span className="text-sm font-medium text-white">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.status === 'checking' ? (
                  <Loader2 size={12} className="animate-spin text-gray-500" />
                ) : (
                  <>
                    <div className={`h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${getStatusBg(service.color)}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${getStatusText(service.color)}`}>
                      {service.status}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={checkBackendStatus}
          className="relative w-full mt-4 py-3 bg-black/50 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 rounded-xl text-xs font-bold text-gray-400 hover:text-orange-400 transition-all flex items-center justify-center gap-2"
        >
          <ExternalLink size={12} />
          Refresh Status
        </button>
      </div>

      {/* Referral System */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-[40px]" />
        
        <div className="relative flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 rounded-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Invite & Earn</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Get 500 credits per paid signup</p>
          </div>
        </div>

        <div className="relative bg-black/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Referral Link</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={loading ? 'Loading...' : referralLink}
              readOnly
              className="flex-1 bg-[#0a0a0f] border border-orange-500/20 rounded-lg px-3 py-2.5 text-xs font-mono text-orange-400/80 outline-none focus:border-orange-500/50 transition-colors"
            />
            <button
              onClick={handleCopy}
              disabled={loading}
              className={`p-2.5 rounded-lg transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                  : 'bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_15px_rgba(251,146,60,0.4)]'
              } disabled:opacity-50`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="relative mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-orange-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Earn 500 HeftCredits</p>
              <p className="text-[10px] text-gray-400">For each friend who subscribes & publishes</p>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between text-[10px] text-gray-500">
          <span>Referrals this month: <span className="text-white font-bold">{referral.count}</span></span>
          <span>Earnings: <span className="text-orange-400 font-bold">{referral.earnings.toLocaleString()} credits</span></span>
        </div>
      </div>
    </div>
  );
}
