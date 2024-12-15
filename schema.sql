-- Sports player profiles base table
CREATE TABLE public.sports_player_profiles (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    hub_profile_id UUID NOT NULL,
    sport_type TEXT NOT NULL,
    skill_level TEXT,
    years_experience TEXT,
    player_stats JSONB DEFAULT '{}'::jsonb,
    sport_specific_data JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT sports_player_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT fk_hub_profile FOREIGN KEY (hub_profile_id) 
        REFERENCES hub_profiles(id) ON DELETE CASCADE,
    CONSTRAINT sports_player_profiles_skill_level_check CHECK (
        skill_level = ANY (ARRAY['Beginner', 'Intermediate', 'Advanced', 'Professional'])
    ),
    CONSTRAINT sports_player_profiles_years_experience_check CHECK (
        years_experience = ANY (ARRAY['0-1', '1-3', '3-5', '5+'])
    ),
    CONSTRAINT sports_player_profiles_sport_type_check CHECK (
        sport_type = ANY (ARRAY['soccer', 'basketball', 'volleyball', 'tennis'])
    )
);

-- Create indexes
CREATE INDEX idx_sports_profiles_sport_type ON public.sports_player_profiles USING btree (sport_type);
CREATE INDEX idx_sports_profiles_hub_profile ON public.sports_player_profiles USING btree (hub_profile_id);
CREATE INDEX idx_sports_profiles_specific_data ON public.sports_player_profiles USING gin (sport_specific_data);