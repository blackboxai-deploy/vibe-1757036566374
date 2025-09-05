/**
 * Chat API endpoint for JARVIS
 * Handles AI conversation with Claude-Sonnet-4
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIClient, ChatMessage } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, language = 'en', userName } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Add system prompt as the first message
    const systemPrompt = AIClient.createSystemPrompt(language, userName);
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Call AI service
    const response = await AIClient.chat(fullMessages);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'AI service error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: response.message,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'JARVIS Chat API is running',
    version: '1.0.0',
    capabilities: ['text-chat', 'multilingual', 'context-aware'],
    supportedLanguages: ['en', 'ar']
  });
}