import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface HubProfile {
  id: string;
  user_id: string;
  hub_id: string;
  bio: string | null;
  profile_picture_url: string | null;
  stats: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface SportsProfile {
  id: string;
  hub_profile_id: string;
  sport_type: 'soccer' | 'basketball' | 'volleyball' | 'tennis';
  skill_level: string | null;
  years_experience: string | null;
  player_stats: Record<string, any>;
  sport_specific_data: Record<string, any>;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CompleteProfile extends HubProfile {
  sports: SportsProfile | null;
}

export const useHubProfile = (userId: string | null, hubId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CompleteProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeProfile = async () => {
      if (!userId || !hubId) return;
      
      try {
        setLoading(true);
        setError(null);

        // First, check if hub profile exists
        let { data: hubProfile, error: hubError } = await supabase
          .from('hub_profiles')
          .select('*')
          .eq('user_id', userId)
          .eq('hub_id', hubId)
          .single();

        if (hubError && hubError.code === 'PGRST116') {
          // Create new hub profile
          const { data: newProfile, error: createError } = await supabase
            .from('hub_profiles')
            .insert({
              user_id: userId,
              hub_id: hubId,
              bio: '',
              stats: {},
            })
            .select()
            .single();

          if (createError) throw createError;
          hubProfile = newProfile;
        } else if (hubError) {
          throw hubError;
        }

        // Then handle sports profile
        let { data: sportsProfile, error: sportsError } = await supabase
          .from('sports_player_profiles')
          .select('*')
          .eq('hub_profile_id', hubProfile.id)
          .eq('sport_type', 'soccer')
          .single();

        if (sportsError && sportsError.code === 'PGRST116') {
          // Create sports profile
          const { data: newSportsProfile, error: createSportsError } = await supabase
            .from('sports_player_profiles')
            .insert({
              hub_profile_id: hubProfile.id,
              sport_type: 'soccer',
              skill_level: null,
              years_experience: null,
              player_stats: {},
              sport_specific_data: {},
              preferences: {}
            })
            .select()
            .single();

          if (createSportsError) throw createSportsError;
          sportsProfile = newSportsProfile;
        } else if (sportsError && sportsError.code !== 'PGRST116') {
          throw sportsError;
        }

        if (isMounted) {
          setProfile({ ...hubProfile, sports: sportsProfile });
        }
      } catch (err) {
        const pgError = err as PostgrestError;
        console.error('Error initializing profile:', pgError);
        if (isMounted) {
          setError(pgError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, hubId]);

  const updateProfile = async (updates: Partial<HubProfile>) => {
    if (!profile?.id) return { error: new Error('Profile not initialized') };

    try {
      const { data, error } = await supabase
        .from('hub_profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...data } : null);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const updateSportsProfile = async (updates: Partial<SportsProfile>) => {
    if (!profile?.sports?.id) return { error: new Error('Sports profile not initialized') };

    try {
      const { data, error } = await supabase
        .from('sports_player_profiles')
        .update(updates)
        .eq('id', profile.sports.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(prev => 
        prev ? { 
          ...prev, 
          sports: { ...prev.sports, ...data } 
        } : null
      );
      return { error: null };
    } catch (error) {
      console.error('Error updating sports profile:', error);
      return { error };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateSportsProfile
  };
};