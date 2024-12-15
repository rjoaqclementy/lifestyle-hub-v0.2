import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Users } from 'lucide-react';

interface MatchOrganizerProps {
  creator: any;
}

const MatchOrganizer: React.FC<MatchOrganizerProps> = ({ creator }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-6"
    >
      <h3 className="font-semibold mb-4">Match Organizer</h3>
      
      <div className="flex items-start space-x-4">
        {creator?.profile_picture_url ? (
          <img
            src={creator.profile_picture_url}
            alt={creator.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
        )}
        
        <div>
          <h4 className="font-semibold">{creator?.name || 'Anonymous Player'}</h4>
          <p className="text-sm text-gray-400 mb-2">{creator?.bio || 'No bio'}</p>
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center text-yellow-500">
              <Trophy className="w-4 h-4 mr-1" />
              <span>{creator?.stats?.matches_organized || 0} matches organized</span>
            </div>
            <div className="flex items-center text-blue-500">
              <Star className="w-4 h-4 mr-1" />
              <span>{creator?.stats?.rating || '5.0'} rating</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchOrganizer;