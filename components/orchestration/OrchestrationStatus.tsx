/**
 * Orchestration Status Component
 * 
 * Displays live orchestration state with phase, progress, and execution log
 */

import React from 'react';
import { OrchestrationState } from '@/lib/orchestration/engine';
import { Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';

interface OrchestrationStatusProps {
    state: OrchestrationState | null;
}

export function OrchestrationStatus({ state }: OrchestrationStatusProps) {
    if (!state || state.phase === 'idle') {
        return null;
    }

    const getPhaseIcon = () => {
        if (state.phase === 'complete') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        if (state.phase === 'error') return <XCircle className="w-5 h-5 text-red-500" />;
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    };

    const getPhaseColor = () => {
        if (state.phase === 'complete') return 'bg-green-500/10 border-green-500/20';
        if (state.phase === 'error') return 'bg-red-500/10 border-red-500/20';
        if (state.phase === 'awaiting_approval') return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-blue-500/10 border-blue-500/20';
    };

    const getPhaseLabel = () => {
        const labels: Record<string, string> = {
            'planning': '🏗️ Planning',
            'awaiting_approval': '⏸️ Awaiting Approval',
            'building_backend': '⚙️ Building Backend',
            'building_frontend': '🎨 Building Frontend',
            'integrating': '🔌 Integrating',
            'qa_testing': '🛡️ Testing & Hardening',
            'deploying': '🚀 Deploying',
            'complete': '✅ Complete',
            'error': '❌ Error'
        };
        return labels[state.phase] || state.phase;
    };

    const getCurrentAgentLabel = () => {
        if (!state.currentAgent) return null;

        const agentLabels: Record<string, string> = {
            'agent-architect': 'The Architect',
            'agent-backend': 'Backend Engineer',
            'agent-frontend': 'Frontend Engineer',
            'agent-integrator': 'The Integrator',
            'agent-qa': 'QA & Hardening',
            'agent-devops': 'DevOps'
        };

        return agentLabels[state.currentAgent];
    };

    return (
        <div className={`border rounded-lg p-4 ${getPhaseColor()}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getPhaseIcon()}
                    <span className="font-semibold text-sm">
                        {getPhaseLabel()}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {state.progress}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${state.progress}%` }}
                />
            </div>

            {/* Current Agent */}
            {state.currentAgent && (
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs">
                        <span className="text-muted-foreground">Active Agent:</span>{' '}
                        <span className="font-medium">{getCurrentAgentLabel()}</span>
                    </span>
                </div>
            )}

            {/* Execution Log (last 3 entries) */}
            {state.executionLog && state.executionLog.length > 0 && (
                <div className="mt-3 space-y-1">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Recent Activity:</div>
                    {state.executionLog.slice(-3).map((entry, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-[10px] opacity-50">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="flex-1">{entry.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {state.error && (
                <div className="mt-3 text-xs text-red-400 bg-red-500/10 rounded p-2">
                    {state.error}
                </div>
            )}
        </div>
    );
}
