-- Drop existing policies
DROP POLICY IF EXISTS "Players can create matches" ON matches;
DROP POLICY IF EXISTS "Match creator can update their matches" ON matches;
DROP POLICY IF EXISTS "Users can view matches" ON matches;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON matches FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users with hub profile"
ON matches FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hub_profiles
    WHERE hub_profiles.id = matches.creator_id
    AND hub_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Enable update for match creators"
ON matches FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hub_profiles
    WHERE hub_profiles.id = matches.creator_id
    AND hub_profiles.user_id = auth.uid()
  )
);