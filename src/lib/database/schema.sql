-- Add followers and privacy settings to profiles
ALTER TABLE profiles
ADD COLUMN is_private BOOLEAN DEFAULT false,
ADD COLUMN followers_count INTEGER DEFAULT 0,
ADD COLUMN following_count INTEGER DEFAULT 0;

-- Create followers table with correct references
CREATE TABLE public.followers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can see their own followers/following"
ON followers FOR SELECT
USING (
    follower_id = auth.uid() OR following_id = auth.uid()
);

CREATE POLICY "Users can follow others"
ON followers FOR INSERT
WITH CHECK (
    follower_id = auth.uid()
);

CREATE POLICY "Users can unfollow"
ON followers FOR DELETE
USING (
    follower_id = auth.uid()
);

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment counts
        UPDATE profiles 
        SET followers_count = followers_count + 1
        WHERE id = NEW.following_id;
        
        UPDATE profiles 
        SET following_count = following_count + 1
        WHERE id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement counts
        UPDATE profiles 
        SET followers_count = followers_count - 1
        WHERE id = OLD.following_id;
        
        UPDATE profiles 
        SET following_count = following_count - 1
        WHERE id = OLD.follower_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_follower_counts_trigger
    AFTER INSERT OR DELETE ON followers
    FOR EACH ROW
    EXECUTE FUNCTION update_follower_counts();