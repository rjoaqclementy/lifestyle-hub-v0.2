import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FollowButtonProps {
  profileId: string;
  isFollowing: boolean;
  isPrivate: boolean;
  onFollowChange: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  profileId,
  isFollowing,
  isPrivate,
  onFollowChange
}) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profileId);

        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: user.id,
            following_id: profileId
          });

        if (error) throw error;
      }

      onFollowChange(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleFollow}
      disabled={loading}
      className={`
        flex items-center gap-2 px-6 py-2 rounded-lg font-medium
        transition-all duration-200
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isFollowing
          ? 'bg-gray-800 hover:bg-red-500/10 hover:text-red-500'
          : 'bg-[#573cff] hover:bg-[#573cff]/80 text-white'
        }
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : isFollowing ? (
        <>
          <UserCheck className="w-5 h-5" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-5 h-5" />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;