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

export function useCreditBalance(userId: string | null, userEmail?: string | null): CreditBalance {
  const [credits, setCredits] = useState(0);
  const [creditsSpent, setCreditsSpent] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!userId && !userEmail) {
      setIsLoading(false);
      return;
    }

    try {
      // First try to find by Clerk user ID
      let data = null;
      let error = null;
      
      if (userId) {
        const result = await supabase
          .from('user_credits')
          .select('credits, credits_spent, subscription_tier, subscription_status, trial_end_date, user_id')
          .eq('user_id', userId)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }

      // If not found by ID, try by email (for legacy records)
      if (!data && userEmail) {
        const emailResult = await supabase
          .from('user_credits')
          .select('credits, credits_spent, subscription_tier, subscription_status, trial_end_date, user_id')
          .eq('user_id', userEmail)
          .maybeSingle();
        
        if (emailResult.data) {
          data = emailResult.data;
          error = emailResult.error;
          // Update the record to use Clerk ID instead of email for future lookups
          if (userId && emailResult.data.user_id === userEmail) {
            console.log('Migrating user_credits record from email to Clerk ID');
            await supabase
              .from('user_credits')
              .update({ user_id: userId })
              .eq('user_id', userEmail);
          }
        }
      }

      if (error && error.code !== 'PGRST116') {
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
        setResolvedUserId(data.user_id);
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
  }, [userId, userEmail]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Subscribe to real-time updates using resolved userId (after email migration)
  useEffect(() => {
    const effectiveId = resolvedUserId || userId;
    if (!effectiveId) return;

    const channel = supabase
      .channel(`credits-${effectiveId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${effectiveId}`,
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
  }, [userId, resolvedUserId]);

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
