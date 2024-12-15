import { supabase } from './supabase';

export const uploadProfileImage = async (file: File, userId: string) => {
  // Generate a unique filename with timestamp
  const timestamp = new Date().getTime();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload the new image
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('profile_pictures')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    throw uploadError;
  }

  return uploadData;
};

export const deleteProfileImage = async (url: string) => {
  const path = url.split('/').slice(-2).join('/');
  const { error } = await supabase.storage
    .from('profile_pictures')
    .remove([path]);
  
  if (error) {
    throw error;
  }
};

export const getPublicUrl = (path: string) => {
  return supabase.storage
    .from('profile_pictures')
    .getPublicUrl(path);
};