/**
 * HashCoder IDE - Chat API (Discussion Mode)
 * 
 * For conversational chat without code generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIEngine } from '@/lib/ai/engine';
import { ConversationalAgent } from '@/lib/agent/conversational';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, mode, conversationHistory } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Missing prompt' },
                { status: 400 }
            );
        }

        // Get conversational system prompt
        const systemPrompt = ConversationalAgent.getSystemPrompt(
            { type: mode || 'discussion', canGenerateCode: false },
            conversationHistory
        );

        // Call Langdock with conversational prompt
        // We'll use the existing runLangdock but with custom system instructions
        const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

        const response = await AIEngine['runLangdock'](
            prompt,
            '', // No file context for discussion
            process.env.LANGDOCK_ASSISTANT_ID,
            conversationHistory || [],
            systemPrompt
        );

        return NextResponse.json({
            success: true,
            response: response.content,
            mode: mode || 'discussion'
        });

    } catch (error: any) {
        console.error('[Chat API] Error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
