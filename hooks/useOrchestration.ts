/**
 * React Hook for Orchestration State
 * 
 * Provides real-time orchestration status updates
 */

import { useState, useEffect } from 'react';
import { OrchestrationState } from '@/lib/orchestration/engine';

export function useOrchestration() {
    const [state, setState] = useState<OrchestrationState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch current orchestration state
    const fetchState = async () => {
        try {
            const response = await fetch('/api/orchestration');
            const data = await response.json();

            if (data.success) {
                setState(data.state);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Start new orchestration
    const startOrchestration = async (userRequest: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/orchestration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start',
                    userRequest
                })
            });

            const data = await response.json();

            if (data.success) {
                setState(data.state);
                return true;
            } else {
                setError(data.error);
                return false;
            }
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Approve plan and trigger auto-execution
    const approvePlan = async (plan: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/orchestration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve_plan',
                    plan
                })
            });

            const data = await response.json();

            if (data.success) {
                setState(data.state);
                return true;
            } else {
                setError(data.error);
                return false;
            }
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Reset orchestration
    const reset = async () => {
        try {
            const response = await fetch('/api/orchestration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reset' })
            });

            const data = await response.json();

            if (data.success) {
                setState(data.state);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Poll for state updates when orchestration is active
    useEffect(() => {
        // Initial fetch
        fetchState();
        
        if (!state || state.phase === 'idle' || state.phase === 'complete') {
            return;
        }

        const interval = setInterval(fetchState, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, [state?.phase]);

    return {
        state,
        isLoading,
        error,
        startOrchestration,
        approvePlan,
        reset,
        fetchState
    };
}
