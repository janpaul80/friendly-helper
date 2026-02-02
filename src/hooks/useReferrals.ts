import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
}

interface Referral {
  id: string;
  referralCode: string;
  status: 'pending' | 'signed_up' | 'subscribed' | 'credited';
  creditsEarned: number;
  createdAt: string;
  completedAt: string | null;
}

export function useReferrals(userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: '',
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const generateReferralCode = useCallback((userId: string) => {
    // Generate a unique referral code based on user ID
    const prefix = 'HEFT';
    const suffix = userId.slice(0, 8).toUpperCase().replace(/-/g, '');
    return `${prefix}-${suffix}`;
  }, []);

  const fetchReferrals = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const referralCode = generateReferralCode(userId);

      // Try to fetch existing referrals
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching referrals:', error);
        // Fallback to generated code if table doesn't exist yet
        setStats({
          referralCode,
          totalReferrals: 0,
          completedReferrals: 0,
          pendingReferrals: 0,
          totalEarnings: 0,
        });
        setReferrals([]);
      } else if (data && data.length > 0) {
        // Calculate stats from referrals
        const completed = data.filter(r => r.status === 'credited').length;
        const pending = data.filter(r => r.status !== 'credited').length;
        const totalEarnings = data.reduce((sum, r) => sum + (r.credits_earned || 0), 0);

        setStats({
          referralCode: data[0].referral_code || referralCode,
          totalReferrals: data.length,
          completedReferrals: completed,
          pendingReferrals: pending,
          totalEarnings,
        });

        setReferrals(data.map(r => ({
          id: r.id,
          referralCode: r.referral_code,
          status: r.status as Referral['status'],
          creditsEarned: r.credits_earned || 0,
          createdAt: r.created_at,
          completedAt: r.completed_at,
        })));
      } else {
        // No referrals yet - just use generated code
        setStats({
          referralCode,
          totalReferrals: 0,
          completedReferrals: 0,
          pendingReferrals: 0,
          totalEarnings: 0,
        });
        setReferrals([]);
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, generateReferralCode]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`referrals-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'referrals',
          filter: `referrer_id=eq.${userId}`,
        },
        () => {
          // Refetch on any change
          fetchReferrals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchReferrals]);

  return {
    stats,
    referrals,
    loading,
    refetch: fetchReferrals,
  };
}
