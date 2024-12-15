-- Add current location fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_city text,
ADD COLUMN IF NOT EXISTS current_country text;