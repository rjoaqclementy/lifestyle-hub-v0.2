-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_profile_and_username;

-- Create the updated function with proper transaction handling
CREATE OR REPLACE FUNCTION update_profile_and_username(
  p_user_id uuid,
  p_username text,
  p_first_name text,
  p_last_name text,
  p_bio text,
  p_country text,
  p_city text,
  p_profile_picture_url text,
  p_is_public boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Start transaction
  BEGIN
    -- Check if username already exists for a different user
    IF EXISTS (
      SELECT 1 FROM usernames 
      WHERE username = p_username 
      AND user_id != p_user_id
    ) THEN
      RAISE EXCEPTION 'Username already taken' USING ERRCODE = '23505';
    END IF;

    -- Update or insert username
    INSERT INTO usernames (user_id, username, created_at, updated_at)
    VALUES (p_user_id, p_username, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET username = EXCLUDED.username,
        updated_at = NOW();

    -- Update profile
    UPDATE profiles
    SET 
      first_name = p_first_name,
      last_name = p_last_name,
      bio = p_bio,
      country = p_country,
      city = p_city,
      profile_picture_url = p_profile_picture_url,
      is_public = p_is_public,
      updated_at = NOW()
    WHERE id = p_user_id
    RETURNING jsonb_build_object(
      'id', id,
      'first_name', first_name,
      'last_name', last_name,
      'bio', bio,
      'country', country,
      'city', city,
      'profile_picture_url', profile_picture_url,
      'is_public', is_public
    ) INTO v_result;

    -- Return the updated profile data
    RETURN v_result;
  EXCEPTION 
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Username already taken' USING ERRCODE = '23505';
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$;