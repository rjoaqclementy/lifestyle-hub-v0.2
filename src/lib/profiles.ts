import { supabase } from './supabase';

export const updateProfilePicture = async (userId: string, url: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ profile_picture_url: url })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};