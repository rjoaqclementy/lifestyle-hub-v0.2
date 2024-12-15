export const validateImageFile = (file: File) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size must be less than 5MB');
  }
};