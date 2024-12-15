-- Function to update both profile and username in a transaction
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
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

    -- Update username
    UPDATE usernames
    SET 
      username = p_username,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    -- If username doesn't exist, insert it
    IF NOT FOUND THEN
      INSERT INTO usernames (username, user_id)
      VALUES (p_username, p_user_id);
    END IF;

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
    WHERE id = p_user_id;

    -- Commit transaction
    COMMIT;
    RETURN true;
  EXCEPTION 
    WHEN unique_violation THEN
      ROLLBACK;
      RAISE EXCEPTION 'Username already taken' USING ERRCODE = '23505';
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;
  END;
END;
$$;