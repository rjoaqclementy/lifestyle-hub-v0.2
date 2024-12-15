import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

interface PlayerSlotProps {
  profile?: any;
  playerProfile?: any;
  empty?: boolean;
  index?: number;
}

const PlayerSlot = ({ profile, playerProfile, empty = false, index = 0 }: PlayerSlotProps) => {
  if (empty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * (index + 1) }}
        className="card p-6 flex items-center justify-center border-2 border-dashed border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group"
      >
        <div className="text-center">
          <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-gray-400 transition-colors" />
          <p className="text-sm text-gray-600 group-hover:text-gray-400 transition-colors">Invite Player</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <img
            src={profile?.profile_picture_url || 'https://via.placeholder.com/100'}
            alt={profile?.full_name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold">{profile?.full_name || 'Anonymous Player'}</h3>
            <p className="text-sm text-gray-400">
              {playerProfile?.skill_level || 'Unranked'} • {playerProfile?.years_experience || 'New Player'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerSlot;