-- =======================================================
-- Supabase Schema for Unicode <-> Preeti Translator
-- Run this script in your Supabase SQL Editor
-- =======================================================

-- 1. Create table for saved translations / snippets
CREATE TABLE IF NOT EXISTS public.saved_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Conversion',
    source_text TEXT NOT NULL,
    converted_text TEXT NOT NULL,
    conversion_mode TEXT NOT NULL CHECK (conversion_mode IN ('unicode-to-preeti', 'preeti-to-unicode')),
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    is_public BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create table for feedback & conversion correction reports
CREATE TABLE IF NOT EXISTS public.feedback_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    original_text TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    actual_output TEXT NOT NULL,
    conversion_mode TEXT NOT NULL CHECK (conversion_mode IN ('unicode-to-preeti', 'preeti-to-unicode')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create table for custom dictionary overrides
CREATE TABLE IF NOT EXISTS public.custom_dictionary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preeti_term TEXT NOT NULL,
    unicode_term TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.saved_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_dictionary ENABLE ROW LEVEL SECURITY;

-- 5. Policies for saved_translations
-- Allow anyone to read public translations (for sharing)
CREATE POLICY "Public translations are viewable by everyone" 
    ON public.saved_translations 
    FOR SELECT 
    USING (is_public = true OR auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users or guests to insert translations
CREATE POLICY "Users can create translations" 
    ON public.saved_translations 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own translations
CREATE POLICY "Users can update their own translations" 
    ON public.saved_translations 
    FOR UPDATE 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own translations
CREATE POLICY "Users can delete their own translations" 
    ON public.saved_translations 
    FOR DELETE 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- 6. Policies for feedback_reports
CREATE POLICY "Anyone can submit feedback" 
    ON public.feedback_reports 
    FOR INSERT 
    WITH CHECK (true);

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_translations_user_id ON public.saved_translations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_translations_is_public ON public.saved_translations(is_public);
CREATE INDEX IF NOT EXISTS idx_saved_translations_created_at ON public.saved_translations(created_at DESC);

