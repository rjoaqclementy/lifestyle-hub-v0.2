-- Add new columns to matches table
ALTER TABLE matches 
ADD COLUMN gender_preference text NOT NULL DEFAULT 'mixed',
ADD COLUMN skill_level text NOT NULL DEFAULT 'all',
ADD CONSTRAINT matches_gender_preference_check 
  CHECK (gender_preference IN ('mixed', 'men', 'women')),
ADD CONSTRAINT matches_skill_level_check 
  CHECK (skill_level IN ('all', 'beginner', 'intermediate', 'advanced'));