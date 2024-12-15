-- Add unique constraint to prevent duplicate lobbies
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_hub_lobby'
    ) THEN
        ALTER TABLE lobbies 
        DROP CONSTRAINT unique_user_hub_lobby;
    END IF;
END $$;

-- Add unique constraint
ALTER TABLE lobbies 
ADD CONSTRAINT unique_user_hub_lobby UNIQUE (host_id, hub_id);

-- Add indexes for better performance
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_lobbies_host_hub'
    ) THEN
        CREATE INDEX idx_lobbies_host_hub ON lobbies(host_id, hub_id);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_lobbies_code'
    ) THEN
        CREATE INDEX idx_lobbies_code ON lobbies(code);
    END IF;
END $$;

-- Update RLS policies
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own lobbies" ON lobbies;
DROP POLICY IF EXISTS "Users can create their own lobbies" ON lobbies;
DROP POLICY IF EXISTS "Users can update their own lobbies" ON lobbies;
DROP POLICY IF EXISTS "Users can delete their own lobbies" ON lobbies;

-- Create new policies
CREATE POLICY "Users can view their own lobbies"
ON lobbies FOR SELECT
USING (
  host_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM lobby_members lm
    WHERE lm.lobby_id = id
    AND (
      lm.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM guest_players gp
        WHERE gp.id = lm.guest_id
        AND gp.creator_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can create their own lobbies"
ON lobbies FOR INSERT
WITH CHECK (host_id = auth.uid());

CREATE POLICY "Users can update their own lobbies"
ON lobbies FOR UPDATE
USING (host_id = auth.uid());

CREATE POLICY "Users can delete their own lobbies"
ON lobbies FOR DELETE
USING (host_id = auth.uid());