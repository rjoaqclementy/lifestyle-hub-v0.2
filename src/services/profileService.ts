import { supabase } from '../lib/supabase';
import { HUBS } from '../lib/constants';

export const fetchSoccerProfile = async (userId: string) => {
  try {
    // First, fetch the hub profile
    const { data: hubProfile, error: hubError } = await supabase
      .from('hub_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('hub_id', HUBS.SOCCER)
      .single();

    if (hubError && hubError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from('hub_profiles')
        .insert({
          user_id: userId,
          hub_id: HUBS.SOCCER,
          bio: '',
          stats: {}
        })
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    }

    if (hubError) throw hubError;
    return hubProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateSoccerProfile = async (userId: string, profileData: any) => {
  try {
    // Get the hub profile
    const { data: hubProfile, error: hubError } = await supabase
      .from('hub_profiles')
      .select('id')
      .eq('user_id', userId)
      .eq('hub_id', HUBS.SOCCER)
      .single();

    if (hubError) throw hubError;

    // Update hub profile
    const { error: updateError } = await supabase
      .from('hub_profiles')
      .update({
        bio: profileData.bio,
        profile_picture_url: profileData.profile_picture_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', hubProfile.id);

    if (updateError) throw updateError;

    return await fetchSoccerProfile(userId);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};