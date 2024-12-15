-- Add onboarding fields to profiles table
ALTER TABLE profiles
ADD COLUMN username text UNIQUE,
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN onboarding_completed boolean DEFAULT false,
ADD COLUMN onboarding_step text DEFAULT 'welcome',
ADD COLUMN selected_hubs text[] DEFAULT '{}';

-- Update the full_name trigger to use first and last name
CREATE OR REPLACE FUNCTION update_full_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_name = TRIM(COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_full_name_trigger
  BEFORE INSERT OR UPDATE OF first_name, last_name
  ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_full_name();