-- Create trigger function for default lobby
CREATE OR REPLACE FUNCTION create_default_lobby()
RETURNS TRIGGER AS $$
DECLARE
  v_lobby_id UUID;
BEGIN
  -- Create default lobby using the NEW row's values
  INSERT INTO lobbies (
    host_id,
    hub_id,
    code,
    is_private,
    status
  ) VALUES (
    NEW.user_id,
    NEW.hub_id,
    UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 6)),
    false,
    'open'
  )
  RETURNING id INTO v_lobby_id;

  -- Add host as a member
  INSERT INTO lobby_members (
    lobby_id,
    user_id,
    is_ready
  ) VALUES (
    v_lobby_id,
    NEW.user_id,
    false
  );

  -- Log lobby creation
  RAISE NOTICE 'Created default lobby % for user % in hub %', v_lobby_id, NEW.user_id, NEW.hub_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create default lobby
DROP TRIGGER IF EXISTS create_default_lobby_trigger ON hub_profiles;
CREATE TRIGGER create_default_lobby_trigger
  AFTER INSERT ON hub_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_lobby();

-- Function to get or create user's lobby
CREATE OR REPLACE FUNCTION get_or_create_lobby(
  p_user_id UUID,
  p_hub_id UUID
)
RETURNS TABLE (
  id UUID,
  code TEXT,
  is_private BOOLEAN,
  status TEXT
) AS $$
DECLARE
  v_lobby_id UUID;
  v_hub_profile_id UUID;
BEGIN
  -- Get hub profile ID
  SELECT id INTO v_hub_profile_id
  FROM hub_profiles
  WHERE user_id = p_user_id AND hub_id = p_hub_id;

  -- If no hub profile exists, return null
  IF v_hub_profile_id IS NULL THEN
    RETURN;
  END IF;

  -- Try to get existing lobby first
  SELECT id INTO v_lobby_id
  FROM lobbies
  WHERE host_id = p_user_id AND hub_id = p_hub_id
  LIMIT 1;

  -- If no lobby exists, create one
  IF v_lobby_id IS NULL THEN
    INSERT INTO lobbies (
      host_id,
      hub_id,
      code,
      is_private,
      status
    ) VALUES (
      p_user_id,
      p_hub_id,
      UPPER(SUBSTRING(MD5(v_hub_profile_id::text || clock_timestamp()::text) FROM 1 FOR 6)),
      false,
      'open'
    )
    RETURNING id INTO v_lobby_id;

    -- Add host as a member
    INSERT INTO lobby_members (
      lobby_id,
      user_id,
      is_ready
    ) VALUES (
      v_lobby_id,
      p_user_id,
      false
    );

    -- Log lobby creation
    RAISE NOTICE 'Created lobby % for user % in hub %', v_lobby_id, p_user_id, p_hub_id;
  END IF;

  -- Return lobby details
  RETURN QUERY
  SELECT l.id, l.code, l.is_private, l.status
  FROM lobbies l 
  WHERE l.id = v_lobby_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;