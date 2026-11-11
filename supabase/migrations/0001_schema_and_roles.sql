/*
================================================================================
STACKED - Supabase Migration: 0001_schema_and_roles.sql
Database Schema, Row Level Security (RLS) & Role-Based Access Control
================================================================================

STORAGE SETUP INSTRUCTIONS (Supabase Dashboard):
--------------------------------------------------------------------------------
1. Log in to your Supabase Project Dashboard: https://supabase.com/dashboard/project/_/storage/buckets
2. Click on "Storage" in the left sidebar menu.
3. Click "New Bucket":
   - Name: "lessons"
   - Public bucket: Toggle to ON (Enabled). This allows video playback by all students.
   - File size limit: Optional (e.g. 500 MB).
   - Allowed MIME types: video/mp4, video/webm, video/quicktime
   - Click "Save".
4. Set Up Storage RLS Policies:
   Go to Storage > Configuration > Policies (or SQL Editor) and apply:

   -- Policy 1: Anyone (public or authenticated) can view/download video lessons:
   CREATE POLICY "Public Read Access for Lessons"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'lessons');

   -- Policy 2: Only users with the 'admin' role can upload files to 'lessons':
   CREATE POLICY "Admins can upload video lessons"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'lessons' AND
     EXISTS (
       SELECT 1 FROM public.users
       WHERE users.id = auth.uid() AND users.role = 'admin'
     )
   );

   -- Policy 3: Only admins can delete/modify files in 'lessons':
   CREATE POLICY "Admins can delete video lessons"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'lessons' AND
     EXISTS (
       SELECT 1 FROM public.users
       WHERE users.id = auth.uid() AND users.role = 'admin'
     )
   );
================================================================================
*/

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create "users" table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    total_points INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create "videos" table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    transcript TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create "quizzes" table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    quiz_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Create "student_progress" table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, quiz_id)
);

-- ==============================================================================
-- 6. Helper Function: Check Admin Role
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all four tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- 7.1 "users" RLS
-- Anyone authenticated can view user profiles (needed for role validation & leaderboard)
CREATE POLICY "Users can read all profiles"
ON public.users FOR SELECT
USING (true);

-- Users can update their own row (e.g. updating total_points/level upon quiz completion)
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- 7.2 "videos" RLS
-- SELECT is public (or authenticated)
CREATE POLICY "Videos are readable by all users"
ON public.videos FOR SELECT
USING (true);

-- INSERT/UPDATE/DELETE restricted to users where role = 'admin'
CREATE POLICY "Only admins can insert videos"
ON public.videos FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update videos"
ON public.videos FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Only admins can delete videos"
ON public.videos FOR DELETE
USING (public.is_admin());

-- 7.3 "quizzes" RLS
-- SELECT is public (or authenticated)
CREATE POLICY "Quizzes are readable by all users"
ON public.quizzes FOR SELECT
USING (true);

-- INSERT/UPDATE/DELETE restricted to users where role = 'admin'
CREATE POLICY "Only admins can insert quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update quizzes"
ON public.quizzes FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Only admins can delete quizzes"
ON public.quizzes FOR DELETE
USING (public.is_admin());

-- 7.4 "student_progress" RLS
-- Users can only SELECT and INSERT where student_id = auth.uid()
CREATE POLICY "Students can view their own progress"
ON public.student_progress FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own progress"
ON public.student_progress FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own progress"
ON public.student_progress FOR UPDATE
USING (auth.uid() = student_id);

-- ==============================================================================
-- 8. Auto-Provisioning Trigger on auth.users
-- Automatically inserts a new row into public.users with role 'student' on signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role TEXT;
BEGIN
    -- Check if metadata explicitly requested 'admin', otherwise default strictly to 'student'
    assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
    IF assigned_role NOT IN ('student', 'admin') THEN
        assigned_role := 'student';
    END IF;

    INSERT INTO public.users (id, role, total_points, level)
    VALUES (
        new.id,
        assigned_role,
        CASE WHEN assigned_role = 'admin' THEN 5000 ELSE 0 END,
        CASE WHEN assigned_role = 'admin' THEN 10 ELSE 1 END
    )
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if existing and create fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 9. Storage Bucket Helper for 'lessons'
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'lessons',
    'lessons',
    true,
    524288000,
    ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/wav', 'audio/mp4']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 524288000;

DROP POLICY IF EXISTS "Public Read Access for Lessons" ON storage.objects;
CREATE POLICY "Public Read Access for Lessons"
ON storage.objects FOR SELECT
USING (bucket_id = 'lessons');

DROP POLICY IF EXISTS "Admins can upload video lessons" ON storage.objects;
CREATE POLICY "Admins can upload video lessons"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'lessons' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can delete video lessons" ON storage.objects;
CREATE POLICY "Admins can delete video lessons"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'lessons' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);
