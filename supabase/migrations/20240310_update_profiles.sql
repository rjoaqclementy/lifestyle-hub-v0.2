-- Update profiles table to handle new fields and constraints
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_gender_check CASCADE;

-- Add gender constraint
ALTER TABLE profiles
ADD CONSTRAINT profiles_gender_check 
CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Remove problematic trigger
DROP TRIGGER IF EXISTS set_hub_profile_defaults_trigger ON hub_profiles;
DROP FUNCTION IF EXISTS set_hub_profile_defaults();

-- Add default values for new profiles
ALTER TABLE profiles
ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());

ALTER TABLE profiles
ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

ALTER TABLE profiles
ALTER COLUMN onboarding_completed SET DEFAULT false;

-- Update existing NULL values
UPDATE profiles 
SET onboarding_completed = false 
WHERE onboarding_completed IS NULL;