-- First, enable RLS on match_players table if not already enabled
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Players can join matches" ON match_players;
DROP POLICY IF EXISTS "Players can leave matches" ON match_players;

-- Create function to check player eligibility
CREATE OR REPLACE FUNCTION check_player_eligibility(match_id UUID, player_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_match RECORD;
  v_player RECORD;
  v_sports_profile RECORD;
  v_current_players INT;
  v_men_count INT;
  v_women_count INT;
BEGIN
  -- Get match details
  SELECT * INTO v_match FROM matches WHERE id = match_id;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Get player profile
  SELECT p.* INTO v_player 
  FROM profiles p 
  WHERE id = player_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Get sports player profile
  SELECT sp.* INTO v_sports_profile
  FROM hub_profiles hp
  JOIN sports_player_profiles sp ON sp.hub_profile_id = hp.id
  WHERE hp.user_id = player_id
  AND hp.hub_id = v_match.hub_id;

  -- Check gender restrictions
  IF v_match.restrictions->>'gender' = 'men-only' THEN
    IF v_player.gender != 'male' THEN
      RETURN FALSE;
    END IF;
  ELSIF v_match.restrictions->>'gender' = 'women-only' THEN
    IF v_player.gender != 'female' THEN
      RETURN FALSE;
    END IF;
  ELSIF v_match.restrictions->>'gender' = 'gender-ratio' THEN
    -- Get current player counts by gender
    SELECT 
      COUNT(*) FILTER (WHERE p.gender = 'male') AS men,
      COUNT(*) FILTER (WHERE p.gender = 'female') AS women
    INTO v_men_count, v_women_count
    FROM match_players mp
    JOIN hub_profiles hp ON hp.id = mp.player_id
    JOIN profiles p ON p.id = hp.user_id
    WHERE mp.match_id = match_id;

    -- Check if adding this player would violate the ratio
    IF v_player.gender = 'male' AND 
       (v_men_count + 1)::float / NULLIF((v_match.restrictions->'genderRatio'->>'men')::int, 0) > 
       v_women_count::float / NULLIF((v_match.restrictions->'genderRatio'->>'women')::int, 0) 
    THEN
      RETURN FALSE;
    END IF;

    IF v_player.gender = 'female' AND
       (v_women_count + 1)::float / NULLIF((v_match.restrictions->'genderRatio'->>'women')::int, 0) >
       v_men_count::float / NULLIF((v_match.restrictions->'genderRatio'->>'men')::int, 0)
    THEN
      RETURN FALSE;
    END IF;
  END IF;

  -- Check age restrictions
  IF v_player.birthday IS NOT NULL THEN
    IF v_match.restrictions->>'age' = 'under-18' THEN
      IF (DATE_PART('year', age(v_player.birthday)) >= 18) THEN
        RETURN FALSE;
      END IF;
    ELSIF v_match.restrictions->>'age' = 'over-18' THEN
      IF (DATE_PART('year', age(v_player.birthday)) < 18) THEN
        RETURN FALSE;
      END IF;
    ELSIF v_match.restrictions->>'age' = 'custom' THEN
      IF (v_match.restrictions->'customAgeRange'->>'min')::int IS NOT NULL AND
         DATE_PART('year', age(v_player.birthday)) < (v_match.restrictions->'customAgeRange'->>'min')::int THEN
        RETURN FALSE;
      END IF;
      IF (v_match.restrictions->'customAgeRange'->>'max')::int IS NOT NULL AND
         DATE_PART('year', age(v_player.birthday)) > (v_match.restrictions->'customAgeRange'->>'max')::int THEN
        RETURN FALSE;
      END IF;
    END IF;
  END IF;

  -- Check skill level restrictions
  IF v_match.restrictions->'skillLevel' ? 'all' = false AND v_sports_profile.skill_level IS NOT NULL THEN
    IF NOT (v_match.restrictions->'skillLevel' ? v_sports_profile.skill_level) THEN
      RETURN FALSE;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy for joining matches
CREATE POLICY "Players can join matches"
ON match_players
FOR INSERT
WITH CHECK (
  check_player_eligibility(match_id, auth.uid())
);

-- Create policy for leaving matches
CREATE POLICY "Players can leave matches"
ON match_players
FOR DELETE
USING (
  player_id IN (
    SELECT hp.id 
    FROM hub_profiles hp 
    WHERE hp.user_id = auth.uid()
  )
);