/**
 * Orchestration API Endpoint
 * 
 * Handles:
 * - Starting new orchestrations
 * - Approving plans
 * - Tool invocations from agents
 * - State queries
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator, HANDOFF_TOOLS } from '@/lib/orchestration/engine';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, ...params } = body;

        const orchestrator = getOrchestrator();

        switch (action) {
            case 'start':
                // User starts a new project
                await orchestrator.startOrchestration(params.userRequest);
                return NextResponse.json({
                    success: true,
                    state: orchestrator.getState()
                });

            case 'approve_plan':
                // User approves the plan - THIS TRIGGERS AUTO-EXECUTION
                await orchestrator.approvePlan(params.plan);
                return NextResponse.json({
                    success: true,
                    state: orchestrator.getState(),
                    message: 'Plan approved. Backend agent is now building...'
                });

            case 'tool_call':
                // An agent invoked a handoff tool
                await orchestrator.handleToolCall(params.toolName, params.parameters);
                return NextResponse.json({
                    success: true,
                    state: orchestrator.getState()
                });

            case 'get_state':
                // Query current orchestration state
                return NextResponse.json({
                    success: true,
                    state: orchestrator.getState()
                });

            case 'reset':
                // Reset orchestration
                orchestrator.reset();
                return NextResponse.json({
                    success: true,
                    state: orchestrator.getState()
                });

            default:
                return NextResponse.json(
                    { success: false, error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error('[Orchestration API] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const orchestrator = getOrchestrator();

        return NextResponse.json({
            success: true,
            state: orchestrator.getState(),
            availableTools: Object.keys(HANDOFF_TOOLS)
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
