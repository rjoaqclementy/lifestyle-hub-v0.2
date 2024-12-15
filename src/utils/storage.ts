import { supabase } from '../lib/supabase';

export const uploadProfilePicture = async (file: File, userId: string, oldUrl: string | null) => {
  if (!userId || userId === 'undefined') {
    throw new Error('User ID is required for upload');
  }

  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const safeUserId = userId.replace(/[^a-zA-Z0-9-]/g, '');
  const fileName = `${safeUserId}/${timestamp}.${fileExt}`;

  // Delete old image if exists
  if (oldUrl) {
    const oldPath = oldUrl.split('profile_pictures/')[1];
    if (oldPath) {
      await supabase.storage
        .from('profile_pictures')
        .remove([oldPath])
        .catch(error => console.warn('Failed to delete old image:', error));
    }
  }

  // Upload new image
  const { error: uploadError, data } = await supabase.storage
    .from('profile_pictures')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/jpeg'
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile_pictures')
    .getPublicUrl(fileName);

  if (!publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return publicUrl;
};

export const uploadPlayerCard = async (file: File, userId: string, oldUrl: string | null) => {
  if (!userId || userId === 'undefined') {
    throw new Error('User ID is required for upload');
  }

  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now(); 
  const safeUserId = userId.replace(/[^a-zA-Z0-9-]/g, '');
  const fileName = `${safeUserId}/${timestamp}-card.${fileExt}`;

  // Delete old card if exists
  if (oldUrl) {
    const oldPath = oldUrl.split('player_cards/')[1];
    if (oldPath) {
      await supabase.storage
        .from('player_cards')
        .remove([oldPath])
        .catch(error => console.warn('Failed to delete old card:', error));
    }
  }

  // Upload new card
  const { error: uploadError, data } = await supabase.storage
    .from('player_cards')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    if (uploadError.message.includes('duplicate')) {
      // If duplicate, try again with new timestamp
      const newTimestamp = Date.now();
      const newFileName = `${safeUserId}/${newTimestamp}-card.${fileExt}`;
      const { error: retryError, data: retryData } = await supabase.storage
        .from('player_cards')
        .upload(newFileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });
      
      if (retryError) throw retryError;
      data = retryData;
    } else {
      throw uploadError;
    }
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('player_cards')
    .getPublicUrl(data?.path || fileName);

  if (!publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return publicUrl;
};