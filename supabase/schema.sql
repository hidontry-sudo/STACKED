-- ==============================================================================
-- STACKED Database Schema (Supabase PostgreSQL)
-- Gamified Financial Literacy Application
-- Tables: users, videos, quizzes, student_progress
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create USERS Table
-- Extends Supabase auth.users with gamification stats, role, and levels
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    username TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    points INTEGER NOT NULL DEFAULT 1240,
    level INTEGER NOT NULL DEFAULT 4,
    level_title TEXT NOT NULL DEFAULT 'Saver',
    streak INTEGER NOT NULL DEFAULT 7,
    saved_this_month NUMERIC(10, 2) DEFAULT 184.00,
    financial_health INTEGER DEFAULT 82,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create VIDEOS Table
-- Stores uploaded financial education lessons, public storage URLs, and transcripts
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    chapter_number INTEGER DEFAULT 1,
    video_url TEXT NOT NULL,
    storage_path TEXT,
    duration TEXT DEFAULT '8 min',
    transcript TEXT,
    instructor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create QUIZZES Table
-- Stores AI-generated quizzes linked to video lessons as JSONB
-- quiz_data structure: Array of { question: string, options: string[], correctAnswer: string }
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Checkpoint Quiz',
    passing_score INTEGER NOT NULL DEFAULT 75,
    points_reward INTEGER NOT NULL DEFAULT 100,
    quiz_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Create STUDENT_PROGRESS Table
-- Tracks student quiz completions, test scores, and earned XP
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    points_earned INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, quiz_id)
);

-- ==============================================================================
-- 6. Helper Functions
-- ==============================================================================

-- Check if current authenticated user has instructor role
CREATE OR REPLACE FUNCTION public.is_instructor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 7. Row Level Security (RLS)
-- Students can only read videos/quizzes and write to their own progress.
-- Instructors can insert/update videos and quizzes.
-- ==============================================================================

-- Enable RLS on all 4 tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- 7.1 USERS Policies
-- Public can view user profiles (needed for leaderboards/instructors)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users FOR SELECT USING (true);

-- Users can update their own profile data (points, streak, etc.)
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE USING (auth.uid() = id);

-- 7.2 VIDEOS Policies
-- All users (students and instructors) can read video lessons
CREATE POLICY "Videos are viewable by all authenticated users" 
ON public.videos FOR SELECT USING (true);

-- Instructors can insert videos
CREATE POLICY "Instructors can insert videos" 
ON public.videos FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND public.is_instructor()
);

-- Instructors can update their videos
CREATE POLICY "Instructors can update videos" 
ON public.videos FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (instructor_id = auth.uid() OR public.is_instructor())
);

-- Instructors can delete their videos
CREATE POLICY "Instructors can delete videos" 
ON public.videos FOR DELETE USING (
    auth.uid() IS NOT NULL AND (instructor_id = auth.uid() OR public.is_instructor())
);

-- 7.3 QUIZZES Policies
-- All users can read quizzes to participate in checkpoints
CREATE POLICY "Quizzes are viewable by all authenticated users" 
ON public.quizzes FOR SELECT USING (true);

-- Instructors can insert/generate quizzes
CREATE POLICY "Instructors can insert quizzes" 
ON public.quizzes FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND public.is_instructor()
);

-- Instructors can update quizzes
CREATE POLICY "Instructors can update quizzes" 
ON public.quizzes FOR UPDATE USING (
    auth.uid() IS NOT NULL AND public.is_instructor()
);

-- Instructors can delete quizzes
CREATE POLICY "Instructors can delete quizzes" 
ON public.quizzes FOR DELETE USING (
    auth.uid() IS NOT NULL AND public.is_instructor()
);

-- 7.4 STUDENT_PROGRESS Policies
-- Students can read their own progress
CREATE POLICY "Students can view their own progress" 
ON public.student_progress FOR SELECT USING (
    auth.uid() = user_id
);

-- Students can insert their own quiz submissions
CREATE POLICY "Students can insert their own progress" 
ON public.student_progress FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

-- Students can update their own progress
CREATE POLICY "Students can update their own progress" 
ON public.student_progress FOR UPDATE USING (
    auth.uid() = user_id
);

-- ==============================================================================
-- 8. Authentication Trigger
-- Automatically inserts a row into public.users when a new auth user is created
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role TEXT;
    user_full_name TEXT;
    user_handle TEXT;
BEGIN
    -- Extract role from metadata, default to 'student'
    default_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
    user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
    user_handle := '@' || split_part(new.email, '@', 1);

    INSERT INTO public.users (
        id,
        email,
        full_name,
        username,
        role,
        points,
        level,
        level_title,
        streak
    )
    VALUES (
        new.id,
        new.email,
        user_full_name,
        user_handle,
        default_role,
        CASE WHEN default_role = 'instructor' THEN 5000 ELSE 1240 END,
        CASE WHEN default_role = 'instructor' THEN 10 ELSE 4 END,
        CASE WHEN default_role = 'instructor' THEN 'Faculty Lead' ELSE 'Saver' END,
        7
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 9. Supabase Storage: 'lessons' Bucket Configuration
-- ==============================================================================

-- Create public 'lessons' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'lessons', 
    'lessons', 
    true, 
    524288000, -- 500 MB max size
    ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/mp4']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 524288000;

-- Storage RLS: Anyone can view/download public lesson videos
CREATE POLICY "Public Access for Lessons"
ON storage.objects FOR SELECT
USING (bucket_id = 'lessons');

-- Storage RLS: Authenticated instructors can upload lesson files
CREATE POLICY "Instructors can upload lesson videos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'lessons' AND 
    auth.role() = 'authenticated'
);

-- Storage RLS: Instructors can delete lesson files
CREATE POLICY "Instructors can delete lesson videos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'lessons' AND 
    auth.role() = 'authenticated'
);
