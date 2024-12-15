import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';

interface ProfileStatsProps {
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  profileId: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  followersCount,
  followingCount,
  isOwnProfile,
  profileId
}) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-6"
      >
        <button 
          onClick={() => setShowFollowers(true)}
          className="text-center hover:text-[#573cff] transition-colors"
        >
          <div className="text-xl font-bold">{followersCount}</div>
          <div className="text-sm text-gray-400">Followers</div>
        </button>

        <button 
          onClick={() => setShowFollowing(true)}
          className="text-center hover:text-[#573cff] transition-colors"
        >
          <div className="text-xl font-bold">{followingCount}</div>
          <div className="text-sm text-gray-400">Following</div>
        </button>
      </motion.div>

      <AnimatePresence>
        {showFollowers && (
          <FollowersModal
            profileId={profileId}
            isOpen={showFollowers}
            onClose={() => setShowFollowers(false)}
          />
        )}

        {showFollowing && (
          <FollowingModal
            profileId={profileId}
            isOpen={showFollowing}
            onClose={() => setShowFollowing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileStats;