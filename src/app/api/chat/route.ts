import { NextRequest, NextResponse } from 'next/server';
import { chatWithMintAI, MintChatContext } from '@/lib/groq';

/**
 * MINT AI Assistant API Route
 * Handles Groq Llama 3 chat with flexible, personalized financial advisor system prompt.
 * Uses purely local mock state & game context (Simulated Wealth, Player Level).
 * No database connections or Supabase infrastructure used.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], userContext = {} } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'User message is required' },
        { status: 400 }
      );
    }

    const context: MintChatContext = {
      simulatedWealth: Number(userContext.simulatedWealth) || 1050,
      level: Number(userContext.level) || 4,
      levelTitle: String(userContext.levelTitle || 'Saver'),
      currency: userContext.currency === 'IDR' ? 'IDR' : 'USD',
      streak: Number(userContext.streak) || 7,
    };

    // Generate response using Groq Llama 3 with customized financial advisor system prompt
    const reply = await chatWithMintAI(message, history, context);

    return NextResponse.json({
      success: true,
      reply,
      context: {
        level: context.level,
        simulatedWealth: context.simulatedWealth,
        currency: context.currency,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while processing chat message',
      },
      { status: 500 }
    );
  }
}
