-- Create guest players table
CREATE TABLE public.guest_players (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    profile_picture_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lobby table
CREATE TABLE public.lobbies (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hub_id UUID NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    is_private BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_game', 'closed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lobby members table
CREATE TABLE public.lobby_members (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    lobby_id UUID NOT NULL REFERENCES lobbies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guest_players(id) ON DELETE CASCADE,
    is_ready BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT member_type_check CHECK (
        (user_id IS NOT NULL AND guest_id IS NULL) OR
        (user_id IS NULL AND guest_id IS NOT NULL)
    )
);

-- Add RLS policies
ALTER TABLE guest_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lobby_members ENABLE ROW LEVEL SECURITY;

-- Guest players policies
CREATE POLICY "Users can view their own guest players"
ON guest_players FOR SELECT
USING (
  creator_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM lobby_members lm
    JOIN lobbies l ON l.id = lm.lobby_id
    WHERE lm.guest_id = guest_players.id
    AND l.host_id = auth.uid()
  )
);

CREATE POLICY "Users can create guest players"
ON guest_players FOR INSERT
WITH CHECK (
  creator_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update their own guest players"
ON guest_players FOR UPDATE
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete their own guest players"
ON guest_players FOR DELETE
USING (creator_id = auth.uid());

-- Lobby policies
CREATE POLICY "Anyone can view lobbies"
ON lobbies FOR SELECT
USING (true);

CREATE POLICY "Users can create lobbies"
ON lobbies FOR INSERT
WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update their lobbies"
ON lobbies FOR UPDATE
USING (host_id = auth.uid());

CREATE POLICY "Hosts can delete their lobbies"
ON lobbies FOR DELETE
USING (host_id = auth.uid());

-- Lobby members policies
CREATE POLICY "Anyone can view lobby members"
ON lobby_members FOR SELECT
USING (true);

CREATE POLICY "Users can join lobbies"
ON lobby_members FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM lobbies
        WHERE id = lobby_id
        AND status = 'open'
    )
);

CREATE POLICY "Members can update their own status"
ON lobby_members FOR UPDATE
USING (
    (user_id = auth.uid()) OR
    EXISTS (
        SELECT 1 FROM guest_players
        WHERE id = guest_id
        AND creator_id = auth.uid()
    )
);