import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Users, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageCropModal from '../ImageCropModal';

interface PlayerCardProps {
  profile: any;
  onUpdate: (url: string) => Promise<void>;
  editable?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ profile, onUpdate, editable = false }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      setError(null);
      e.target.value = ''; // Reset input
      setSelectedImage(file);
      setShowCropModal(true);
    }
  };

  const handleCrop = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create a unique file name
      const fileName = `${user.id}/${Date.now()}-player-card.jpg`;

      // Delete old player card if it exists
      if (profile?.player_card_url) {
        const oldPath = profile.player_card_url.split('player_cards/')[1];
        if (oldPath) {
          await supabase.storage
            .from('player_cards')
            .remove([oldPath])
            .catch(err => {
              console.warn('Failed to delete old image:', err);
              // Continue with upload even if delete fails
            });
        }
      }

      // Convert blob to file
      const file = new File([croppedBlob], fileName, { 
        type: 'image/jpeg'
      });

      // Upload to player_cards bucket
      const { error: uploadError } = await supabase.storage
        .from('player_cards')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('player_cards')
        .getPublicUrl(fileName);

      if (!publicUrl) throw new Error('Failed to get public URL');

      await onUpdate(publicUrl);
      setSelectedImage(null);
      setShowCropModal(false);
    } catch (err) {
      console.error('Error uploading player card:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload player card');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full aspect-[9/16] rounded-lg overflow-hidden group bg-gradient-to-b from-gray-800 to-gray-900"
      >
        {profile?.player_card_url && (
          <img
            src={profile.player_card_url}
            alt="Player Card"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              setError('Failed to load image');
            }}
          />
        )}
        
        {!profile?.player_card_url && !profile?.is_guest && (
          <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center">
            <Users className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-center px-4">
              {editable ? 'Click to set player card' : 'No player card set'}
            </p>
          </div>
        )}

        {/* Guest Player Default Card */}
        {profile?.is_guest && !profile?.player_card_url && (
          <div className="w-full h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Guest Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h3 className="text-xl font-bold text-white mb-1">
                {profile.alias || profile.name}
              </h3>
              <p className="text-sm text-gray-300">
                Guest Player
              </p>
            </div>
          </div>
        )}
        {/* Gradient overlay */}
        {!profile?.is_guest && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        )}

        {/* Player info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">
            {profile?.alias || profile?.name || 'Anonymous Player'}
          </h3>
          <p className="text-sm text-gray-300">
            {profile?.skill_level || 'Unranked'} • {
              profile?.years_experience?.replace(/_/g, '-') || 'New Player'
            }
          </p>
        </div>

        {/* Edit overlay */}
        {editable && !uploading && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-center text-white">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span>Change Player Card</span>
            </div>
          </label>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2" />
              <p className="text-white">Uploading...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-500/10 border border-red-500/50 rounded-lg mt-4">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
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
          type="player-card"
        />
      )}
    </div>
  );
};

export default PlayerCard;