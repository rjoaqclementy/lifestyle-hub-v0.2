-- Function to set default name from main profile
CREATE OR REPLACE FUNCTION set_hub_profile_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the full name from the main profile
  SELECT full_name INTO NEW.name
  FROM profiles
  WHERE id = NEW.user_id;
  
  -- If no name is found, use 'Anonymous Player'
  IF NEW.name IS NULL THEN
    NEW.name := 'Anonymous Player';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new hub profiles
CREATE TRIGGER set_hub_profile_defaults_trigger
BEFORE INSERT ON hub_profiles
FOR EACH ROW
EXECUTE FUNCTION set_hub_profile_defaults();

-- Add name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'hub_profiles' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE hub_profiles ADD COLUMN name text;
    
    -- Update existing records
    UPDATE hub_profiles hp
    SET name = p.full_name
    FROM profiles p
    WHERE hp.user_id = p.id;
  END IF;
END $$;