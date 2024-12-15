import { useState, useEffect } from 'react';
import { supabase, HUBS } from '../lib/supabase';

export const useSoccerProfile = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // First get the hub profile
      const { data: hubProfile, error: hubError } = await supabase
        .from('hub_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('hub_id', HUBS.SOCCER)
        .single();

      if (hubError) throw hubError;

      if (!hubProfile) {
        // Initialize profile if it doesn't exist
        const { data: newHubProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert([
            { user_id: userId, hub_id: HUBS.SOCCER }
          ])
          .select()
          .single();

        if (createError) throw createError;
        
        // Create corresponding sports player profile
        const { error: sportsError } = await supabase
          .from('sports_player_profiles')
          .insert([
            { 
              hub_profile_id: newHubProfile.id,
              sport_type: 'soccer'
            }
          ]);

        if (sportsError) throw sportsError;
        
        setProfile(newHubProfile);
      } else {
        // Get the sports player profile
        const { data: sportsProfile, error: sportsError } = await supabase
          .from('sports_player_profiles')
          .select('*')
          .eq('hub_profile_id', hubProfile.id)
          .single();

        if (sportsError) throw sportsError;

        setProfile({ ...hubProfile, ...sportsProfile });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      setLoading(true);

      if (!profile) throw new Error('No profile found');

      // Update hub profile fields
      if ('bio' in updates || 'profile_picture_url' in updates) {
        const { error: hubError } = await supabase
          .from('hub_profiles')
          .update({
            bio: updates.bio,
            profile_picture_url: updates.profile_picture_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (hubError) throw hubError;
      }

      // Update sports player profile fields
      if ('skill_level' in updates || 'years_experience' in updates || 'sport_specific_data' in updates) {
        const { error: sportsError } = await supabase
          .from('sports_player_profiles')
          .update({
            skill_level: updates.skill_level,
            years_experience: updates.years_experience,
            sport_specific_data: updates.sport_specific_data,
            updated_at: new Date().toISOString()
          })
          .eq('hub_profile_id', profile.id);

        if (sportsError) throw sportsError;
      }

      await fetchProfile(); // Refresh the profile data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { profile, loading, error, updateProfile };
};