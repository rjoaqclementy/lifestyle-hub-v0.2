-- Drop existing constraints if they exist
ALTER TABLE lobby_members 
DROP CONSTRAINT IF EXISTS member_type_check;

-- Add proper constraints
ALTER TABLE lobby_members
ADD CONSTRAINT member_type_check 
CHECK (
  (user_id IS NOT NULL AND guest_id IS NULL) OR 
  (user_id IS NULL AND guest_id IS NOT NULL)
);

-- Add unique constraints to prevent duplicates
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_member'
    ) THEN
        ALTER TABLE lobby_members
        ADD CONSTRAINT unique_user_member 
        UNIQUE (lobby_id, user_id) 
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_guest_member'
    ) THEN
        ALTER TABLE lobby_members
        ADD CONSTRAINT unique_guest_member 
        UNIQUE (lobby_id, guest_id) 
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lobby_members_lobby ON lobby_members(lobby_id);
CREATE INDEX IF NOT EXISTS idx_lobby_members_user ON lobby_members(user_id) 
WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lobby_members_guest ON lobby_members(guest_id) 
WHERE guest_id IS NOT NULL;

-- Update RLS policies
ALTER TABLE lobby_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view lobby members" ON lobby_members;
DROP POLICY IF EXISTS "Users can join lobbies" ON lobby_members;
DROP POLICY IF EXISTS "Members can update their own status" ON lobby_members;

-- Create new policies
CREATE POLICY "Users can view lobby members"
ON lobby_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM lobbies l
    WHERE l.id = lobby_id
    AND (
      l.host_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM lobby_members lm
        WHERE lm.lobby_id = l.id
        AND (
          lm.user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM guest_players gp
            WHERE gp.id = lm.guest_id
            AND gp.creator_id = auth.uid()
          )
        )
      )
    )
  )
);

CREATE POLICY "Users can add members"
ON lobby_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM lobbies l
    WHERE l.id = lobby_id
    AND l.host_id = auth.uid()
  )
);

CREATE POLICY "Members can update their own status"
ON lobby_members FOR UPDATE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM guest_players gp
    WHERE gp.id = guest_id
    AND gp.creator_id = auth.uid()
  )
);