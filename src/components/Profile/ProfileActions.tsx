import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Edit2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  profileId: string;
  onFollowChange: (following: boolean) => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isOwnProfile,
  isFollowing,
  profileId,
  onFollowChange
}) => {
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Check out this profile',
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isOwnProfile ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2 px-6 py-2 bg-[#573cff] hover:bg-[#573cff]/80 text-white rounded-lg font-medium transition-all duration-200"
          >
            <Edit2 className="w-5 h-5" />
            <span>Edit Profile</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Profile</span>
          </motion.button>
        </>
      ) : (
        <>
          <FollowButton
            profileId={profileId}
            isFollowing={isFollowing}
            isPrivate={false}
            onFollowChange={onFollowChange}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Message</span>
          </motion.button>
        </>
      )}
    </div>
  );
};

export default ProfileActions;