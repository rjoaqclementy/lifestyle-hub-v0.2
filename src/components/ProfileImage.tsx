import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateImageFile } from '../utils/fileValidation';
import ImageCropModal from './ImageCropModal';

interface ProfileImageProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
  editable?: boolean;
}

const ProfileImage = ({ 
  url, 
  onUpload, 
  size = 150,
  editable = false
}: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload');
      }

      const file = event.target.files[0];
      validateImageFile(file);
      
      setSelectedImage(file);
      setShowCropModal(true);
    } catch (error: any) {
      setError(error.message || 'Failed to select image');
      console.error('Error selecting image:', error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCrop = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      setError(null);

      // Create temporary URL for immediate display
      const tempUrl = URL.createObjectURL(croppedBlob);
      setTempImageUrl(tempUrl);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Convert blob to file
      const file = new File([croppedBlob], 'profile-picture.jpg', { type: 'image/jpeg' });

      // Create a unique file name
      const fileName = `${user.id}/${Date.now()}.jpg`;

      // Delete old profile picture if exists
      if (url) {
        const oldPath = url.split('profile_pictures/')[1];
        if (oldPath) {
          await supabase.storage
            .from('profile_pictures')
            .remove([oldPath]);
        }
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(fileName);

      if (!publicUrl) throw new Error('Failed to get public URL');

      onUpload(publicUrl);
    } catch (error: any) {
      setError(error.message || 'Failed to upload image');
      console.error('Error uploading image:', error);
      setTempImageUrl(null);
    } finally {
      setUploading(false);
      setSelectedImage(null);
      setShowCropModal(false);
    }
  };

  const displayUrl = tempImageUrl || url;

  return (
    <div className="relative">
      <div 
        className={`relative group ${editable ? 'cursor-pointer' : ''}`}
        style={{ width: size, height: size }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Profile"
            className={`rounded-full object-cover w-full h-full border-2 transition-colors ${
              editable ? 'border-gray-700 group-hover:border-[#573cff]' : 'border-gray-700'
            }`}
          />
        ) : (
          <div 
            className={`rounded-full bg-gray-800 flex items-center justify-center border-2 transition-colors ${
              editable ? 'border-gray-700 group-hover:border-[#573cff]' : 'border-gray-700'
            }`}
            style={{ width: size, height: size }}
          >
            <span className="text-3xl text-gray-400">?</span>
          </div>
        )}
        
        {editable && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              disabled={uploading}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="p-2 bg-[#573cff] rounded-full hover:bg-[#573cff]/80 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
            </div>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[#573cff] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-200 border-b-[#573cff] rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {selectedImage && showCropModal && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setSelectedImage(null);
          }}
          imageFile={selectedImage}
          onCropComplete={handleCrop}
          type="profile"
        />
      )}
    </div>
  );
};

export default ProfileImage;