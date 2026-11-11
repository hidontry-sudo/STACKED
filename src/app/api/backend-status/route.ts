import { NextResponse } from 'next/server';
import { isServerSupabaseConfigured } from '@/lib/supabase/server';
import { isGroqConfigured } from '@/lib/groq';

export async function GET() {
  const supabaseReady = isServerSupabaseConfigured();
  const groqReady = isGroqConfigured();

  return NextResponse.json({
    status: 'online',
    services: {
      supabase: {
        configured: supabaseReady,
        database: supabaseReady ? 'Connected (PostgreSQL)' : 'Mock Mode (Awaiting credentials)',
        storage: supabaseReady ? "Connected ('lessons' bucket)" : 'Mock Mode',
        auth: supabaseReady ? 'Active' : 'Local Mock Active',
      },
      groq: {
        configured: groqReady,
        whisperModel: 'whisper-large-v3',
        llmModel: 'llama-3.3-70b-versatile',
        status: groqReady ? 'Active API' : 'Simulated Response Mode',
      },
    },
    tables: ['users', 'videos', 'quizzes', 'student_progress'],
  });
}
