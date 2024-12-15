-- Create match_likes table
CREATE TABLE IF NOT EXISTS public.match_likes (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    match_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(match_id, user_id),
    CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create match_saves table
CREATE TABLE IF NOT EXISTS public.match_saves (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    match_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(match_id, user_id),
    CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Add likes_count to matches
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_match_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE matches 
        SET likes_count = likes_count + 1
        WHERE id = NEW.match_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE matches 
        SET likes_count = likes_count - 1
        WHERE id = OLD.match_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
DROP TRIGGER IF EXISTS update_match_likes_count_trigger ON match_likes;
CREATE TRIGGER update_match_likes_count_trigger
    AFTER INSERT OR DELETE ON match_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_match_likes_count();

-- Enable RLS
ALTER TABLE match_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_saves ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own likes"
ON match_likes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can like matches"
ON match_likes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike matches"
ON match_likes FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own saves"
ON match_saves FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can save matches"
ON match_saves FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave matches"
ON match_saves FOR DELETE
USING (user_id = auth.uid());