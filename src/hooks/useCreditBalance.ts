import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const LOW_BALANCE_THRESHOLD = 500;

interface CreditBalance {
  credits: number;
  subscriptionTier: string | null;
  subscriptionStatus: string;
  isLowBalance: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useCreditBalance(userId: string | null): CreditBalance {
  const [credits, setCredits] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      // user_credits table doesn't exist yet - use defaults
      setCredits(10000);
      setSubscriptionTier('free');
      setSubscriptionStatus('none');
    } catch (err) {
      console.error('Failed to fetch credit balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`credits-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setCredits(newData.credits || 0);
          setSubscriptionTier(newData.subscription_tier);
          setSubscriptionStatus(newData.subscription_status || 'none');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    credits,
    subscriptionTier,
    subscriptionStatus,
    isLowBalance: credits > 0 && credits < LOW_BALANCE_THRESHOLD,
    isLoading,
    refetch: fetchBalance,
  };
}

export { LOW_BALANCE_THRESHOLD };
