import { supabase } from './supabase';

export interface UpdateProfileData {
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  country: string;
  city: string;
  profile_picture_url: string;
  is_public: boolean;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: result, error } = await supabase.rpc(
    'update_profile_and_username',
    {
      p_user_id: user.id,
      p_username: data.username,
      p_first_name: data.first_name,
      p_last_name: data.last_name,
      p_bio: data.bio,
      p_country: data.country,
      p_city: data.city,
      p_profile_picture_url: data.profile_picture_url,
      p_is_public: data.is_public
    }
  );

  if (error) {
    if (error.code === '23505') {
      throw new Error('Username already taken');
    }
    throw error;
  }

  return result;
};