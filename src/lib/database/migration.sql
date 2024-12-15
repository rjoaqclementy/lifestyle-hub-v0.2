-- First, disable triggers temporarily to avoid constraint violations
ALTER TABLE matches DISABLE TRIGGER ALL;
ALTER TABLE match_players DISABLE TRIGGER ALL;

-- Add temporary columns
ALTER TABLE matches 
ADD COLUMN temp_creator_id UUID;

ALTER TABLE match_players
ADD COLUMN temp_player_id UUID;

-- Store current IDs
UPDATE matches 
SET temp_creator_id = creator_id;

UPDATE match_players
SET temp_player_id = player_id;

-- Create hub profiles for existing users
INSERT INTO hub_profiles (id, user_id, hub_id, created_at, updated_at)
SELECT 
  extensions.uuid_generate_v4(),
  m.temp_creator_id,
  (SELECT id FROM hubs WHERE name = 'soccer'),
  NOW(),
  NOW()
FROM matches m
WHERE NOT EXISTS (
  SELECT 1 FROM hub_profiles hp 
  WHERE hp.user_id = m.temp_creator_id 
  AND hp.hub_id = (SELECT id FROM hubs WHERE name = 'soccer')
);

-- Drop existing foreign key constraints
ALTER TABLE matches 
DROP CONSTRAINT IF EXISTS matches_creator_fkey;

ALTER TABLE match_players
DROP CONSTRAINT IF EXISTS match_players_player_fkey,
DROP CONSTRAINT IF EXISTS match_players_player_profile_fkey;

-- Update references to use hub_profile ids
UPDATE matches m
SET creator_id = hp.id
FROM hub_profiles hp
WHERE hp.user_id = m.temp_creator_id
AND hp.hub_id = (SELECT id FROM hubs WHERE name = 'soccer');

UPDATE match_players mp
SET player_id = hp.id
FROM hub_profiles hp
WHERE hp.user_id = mp.temp_player_id
AND hp.hub_id = (SELECT id FROM hubs WHERE name = 'soccer');

-- Add new foreign key constraints
ALTER TABLE matches
ADD CONSTRAINT matches_creator_hub_profile_fkey 
FOREIGN KEY (creator_id) 
REFERENCES hub_profiles(id);

ALTER TABLE match_players
ADD CONSTRAINT match_players_player_hub_profile_fkey
FOREIGN KEY (player_id)
REFERENCES hub_profiles(id);

-- Clean up temporary columns
ALTER TABLE matches 
DROP COLUMN temp_creator_id;

ALTER TABLE match_players
DROP COLUMN temp_player_id;

-- Re-enable triggers
ALTER TABLE matches ENABLE TRIGGER ALL;
ALTER TABLE match_players ENABLE TRIGGER ALL;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can create matches" ON matches;
DROP POLICY IF EXISTS "Match creator can update their matches" ON matches;

CREATE POLICY "Players can create matches"
ON matches FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hub_profiles
    WHERE id = creator_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Match creator can update their matches"
ON matches FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hub_profiles
    WHERE id = creator_id
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can join matches" ON match_players;
DROP POLICY IF EXISTS "Players can update their own status" ON match_players;

CREATE POLICY "Players can join matches"
ON match_players FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hub_profiles
    WHERE id = player_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Players can update their own status"
ON match_players FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hub_profiles
    WHERE id = player_id
    AND user_id = auth.uid()
  )
);