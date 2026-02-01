import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const LOW_BALANCE_THRESHOLD = 500;

interface CreditBalance {
  credits: number;
  creditsSpent: number;
  subscriptionTier: string | null;
  subscriptionStatus: string;
  trialEndDate: string | null;
  isLowBalance: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useCreditBalance(userId: string | null): CreditBalance {
  const [credits, setCredits] = useState(0);
  const [creditsSpent, setCreditsSpent] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits, credits_spent, subscription_tier, subscription_status, trial_end_date')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching credit balance:', error);
        // Use defaults for new users
        setCredits(0);
        setCreditsSpent(0);
        setSubscriptionTier('free');
        setSubscriptionStatus('none');
        setTrialEndDate(null);
      } else if (data) {
        setCredits(data.credits || 0);
        setCreditsSpent(data.credits_spent || 0);
        setSubscriptionTier(data.subscription_tier || 'free');
        setSubscriptionStatus(data.subscription_status || 'none');
        setTrialEndDate(data.trial_end_date);
      } else {
        // No record found - new user with no subscription
        setCredits(0);
        setCreditsSpent(0);
        setSubscriptionTier('free');
        setSubscriptionStatus('none');
        setTrialEndDate(null);
      }
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
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData) {
            setCredits(newData.credits || 0);
            setCreditsSpent(newData.credits_spent || 0);
            setSubscriptionTier(newData.subscription_tier);
            setSubscriptionStatus(newData.subscription_status || 'none');
            setTrialEndDate(newData.trial_end_date);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    credits,
    creditsSpent,
    subscriptionTier,
    subscriptionStatus,
    trialEndDate,
    isLowBalance: credits > 0 && credits < LOW_BALANCE_THRESHOLD,
    isLoading,
    refetch: fetchBalance,
  };
}

export { LOW_BALANCE_THRESHOLD };
