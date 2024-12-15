-- Add likes_count to matches if not exists
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_match_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE matches 
        SET likes_count = COALESCE(likes_count, 0) + 1
        WHERE id = NEW.match_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE matches 
        SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
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

-- Update RLS policies to allow public match viewing
DROP POLICY IF EXISTS "Anyone can view matches" ON matches;
CREATE POLICY "Anyone can view matches"
ON matches FOR SELECT
USING (true);

-- Update RLS policies for social interactions
DROP POLICY IF EXISTS "Users can view match likes" ON match_likes;
DROP POLICY IF EXISTS "Users can like matches" ON match_likes;
DROP POLICY IF EXISTS "Users can unlike matches" ON match_likes;

CREATE POLICY "Users can view match likes"
ON match_likes FOR SELECT
USING (true);

CREATE POLICY "Users can like matches"
ON match_likes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can unlike matches"
ON match_likes FOR DELETE
USING (user_id = auth.uid());