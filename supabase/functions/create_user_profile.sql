-- Create a function to handle user profile creation in a transaction
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id uuid,
  user_email text,
  user_username text,
  user_first_name text,
  user_last_name text,
  user_birthday date,
  user_gender text,
  user_country text,
  user_city text,
  user_interests text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile jsonb;
BEGIN
  -- Start transaction
  BEGIN
    -- Create the profile
    INSERT INTO profiles (
      id,
      email,
      username,
      first_name,
      last_name,
      birthday,
      gender,
      country,
      city,
      interests,
      created_at,
      updated_at,
      onboarding_completed
    ) VALUES (
      user_id,
      user_email,
      user_username,
      user_first_name,
      user_last_name,
      user_birthday,
      user_gender,
      user_country,
      user_city,
      user_interests,
      NOW(),
      NOW(),
      false
    )
    RETURNING jsonb_build_object(
      'id', id,
      'email', email,
      'username', username,
      'first_name', first_name,
      'last_name', last_name,
      'birthday', birthday,
      'gender', gender,
      'country', country,
      'city', city,
      'interests', interests,
      'created_at', created_at,
      'updated_at', updated_at,
      'onboarding_completed', onboarding_completed
    ) INTO v_profile;

    -- Create default hub profile for the user
    INSERT INTO hub_profiles (
      user_id,
      hub_id,
      created_at,
      updated_at
    )
    SELECT 
      user_id,
      id,
      NOW(),
      NOW()
    FROM hubs 
    WHERE name = 'lifestyle';

    -- Return the created profile
    RETURN v_profile;

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    ROLLBACK;
    RAISE;
  END;
END;
$$;

-- Create trigger to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();