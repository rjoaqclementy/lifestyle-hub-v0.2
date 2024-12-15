-- Drop existing guest_players table if it exists
DROP TABLE IF EXISTS public.guest_players CASCADE;

-- Create guest_players table with proper structure
CREATE TABLE public.guest_players (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    profile_picture_url TEXT,
    is_guest BOOLEAN DEFAULT true,
    skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
    years_experience TEXT CHECK (years_experience IN ('0-1', '1-3', '3-5', '5+')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE guest_players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view guest players"
ON guest_players FOR SELECT
USING (creator_id = auth.uid());

CREATE POLICY "Users can create guest players"
ON guest_players FOR INSERT
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own guest players"
ON guest_players FOR UPDATE
USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own guest players"
ON guest_players FOR DELETE
USING (creator_id = auth.uid());