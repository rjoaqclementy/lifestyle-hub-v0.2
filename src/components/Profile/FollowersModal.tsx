import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import FollowButton from './FollowButton';

interface FollowersModalProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FollowersModal: React.FC<FollowersModalProps> = ({
  profileId,
  isOpen,
  onClose
}) => {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, [profileId]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          follower:profiles!followers_follower_id_fkey(
            id,
            username,
            first_name,
            last_name,
            profile_picture_url,
            is_private
          )
        `)
        .eq('following_id', profileId);

      if (error) throw error;
      setFollowers(data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Followers</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#573cff] border-t-transparent" />
            </div>
          ) : followers.length > 0 ? (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div
                  key={follower.follower_id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {follower.follower.profile_picture_url ? (
                      <img
                        src={follower.follower.profile_picture_url}
                        alt={follower.follower.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-xl text-gray-400">
                          {follower.follower.first_name?.[0] || follower.follower.username?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {follower.follower.first_name} {follower.follower.last_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        @{follower.follower.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <UserX className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p>No followers yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FollowersModal;