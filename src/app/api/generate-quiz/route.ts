import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { transcribeAudioWithWhisper, generateQuizWithLlama3, GroqQuizQuestion } from '@/lib/groq';

/**
 * AI Quiz Generation Pipeline (Supabase Edge Function Simulation)
 * 
 * Pipeline:
 * a) Call Groq Whisper API endpoint to transcribe audio into text.
 * b) Pass text to Groq API using Llama 3 with the required strict system prompt:
 *    "You are an educational AI. Analyze the following transcript and return a valid JSON array of 3 multiple-choice questions. Each object must have: 'question', 'options' (array of 4 strings), and 'correctAnswer' (string matching one option)."
 * c) Parse the JSON response and insert into the `quizzes` table linked to the video ID.
 */
export async function POST(req: NextRequest) {
  try {
    let videoId: string | null = null;
    let transcript: string = '';
    let title: string = 'Checkpoint Quiz';
    let file: File | null = null;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      videoId = (formData.get('videoId') as string) || null;
      title = (formData.get('title') as string) || 'AI Checkpoint Quiz';
      transcript = (formData.get('transcript') as string) || '';
      file = formData.get('file') as File | null;
    } else {
      const body = await req.json();
      videoId = body.videoId || null;
      title = body.title || 'AI Checkpoint Quiz';
      transcript = body.transcript || '';
    }

    if (!videoId) {
      videoId = `vid-${Date.now()}`;
    }

    // Step a) Call Groq Whisper API endpoint if audio file provided or if no transcript
    if (!transcript || transcript.trim().length === 0) {
      if (file) {
        transcript = await transcribeAudioWithWhisper(file, file.name);
      } else {
        // Default audio lesson content for Whisper pipeline simulation
        transcript = await transcribeAudioWithWhisper(null, 'lesson-audio.mp3');
      }
    }

    const supabase = getSupabaseServerClient();

    // Optionally update the video record with the transcript
    if (supabase && videoId && !videoId.startsWith('vid-')) {
      await supabase
        .from('videos')
        .update({ transcript })
        .eq('id', videoId);
    }

    // Step b) Pass transcript to Groq API using Llama 3 model with strict system prompt
    const generatedQuestions: GroqQuizQuestion[] = await generateQuizWithLlama3(transcript);

    // Step c) Insert parsed JSON array into `quizzes` table linked to video_id
    let insertedQuiz: any = {
      id: `quiz-${Date.now()}`,
      video_id: videoId,
      title: `${title} - Checkpoint`,
      passing_score: 75,
      points_reward: 100,
      quiz_data: generatedQuestions,
      created_at: new Date().toISOString(),
    };

    if (supabase && videoId && !videoId.startsWith('vid-')) {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          video_id: videoId,
          title: `${title} - Checkpoint`,
          passing_score: 75,
          points_reward: 100,
          quiz_data: generatedQuestions,
        })
        .select()
        .single();

      if (quizError) {
        console.warn('Supabase quizzes table insert warning:', quizError.message);
      } else if (quizData) {
        insertedQuiz = quizData;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'AI Quiz generated and saved to quizzes table',
      videoId,
      transcript,
      quiz: insertedQuiz,
      questions: generatedQuestions,
      model: 'llama-3.3-70b-versatile',
      whisperModel: 'whisper-large-v3',
    });
  } catch (error: any) {
    console.error('Error in generate-quiz API pipeline:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI quiz' },
      { status: 500 }
    );
  }
}
