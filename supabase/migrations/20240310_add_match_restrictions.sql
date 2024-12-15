-- Add restrictions column to matches table
ALTER TABLE matches
ADD COLUMN IF NOT EXISTS restrictions JSONB DEFAULT '{
  "gender": "mixed",
  "age": "none",
  "skillLevel": ["all"],
  "maxPlayers": 0,
  "teamBalancing": true
}'::jsonb;

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_matches_restrictions ON matches USING gin(restrictions);

-- Add validation trigger
CREATE OR REPLACE FUNCTION validate_match_restrictions()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate skill_level field
  IF NOT NEW.skill_level IN ('all', 'beginner', 'intermediate', 'advanced') THEN
    RAISE EXCEPTION 'Invalid skill level';
  END IF;

  -- Validate gender field
  IF NOT (NEW.restrictions->>'gender' IN ('mixed', 'men-only', 'women-only', 'gender-ratio')) THEN
    RAISE EXCEPTION 'Invalid gender restriction';
  END IF;

  -- Validate age field
  IF NOT (NEW.restrictions->>'age' IN ('none', 'under-18', 'under-21', 'over-18', 'over-21', 'custom')) THEN
    RAISE EXCEPTION 'Invalid age restriction';
  END IF;

  -- Ensure maxPlayers is a number
  IF NOT (NEW.restrictions->>'maxPlayers')::int >= 0 THEN
    RAISE EXCEPTION 'maxPlayers must be a non-negative number';
  END IF;

  -- Ensure teamBalancing is boolean
  IF NOT (NEW.restrictions->>'teamBalancing')::boolean IN (true, false) THEN
    RAISE EXCEPTION 'teamBalancing must be a boolean';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS validate_match_restrictions_trigger ON matches;
CREATE TRIGGER validate_match_restrictions_trigger
  BEFORE INSERT OR UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION validate_match_restrictions();