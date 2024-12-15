import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Target } from 'lucide-react';

interface MatchInfoProps {
  match: any;
  creator: any;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ match, creator }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-500';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {match.type.charAt(0).toUpperCase() + match.type.slice(1)} Match
          </h2>
          <p className="text-gray-400">
            Created by {creator?.name || 'Anonymous'}
          </p>
        </div>
        <div className="flex gap-2">
          {match.type === 'competitive' && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
              Competitive
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(match.status)}`}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#573cff]/10 rounded-lg">
            <Users className="w-5 h-5 text-[#573cff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Team Size</p>
            <p className="font-semibold">{match.players_per_team} vs {match.players_per_team}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#573cff]/10 rounded-lg">
            <Trophy className="w-5 h-5 text-[#573cff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Match Type</p>
            <p className="font-semibold capitalize">{match.gender_preference}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#573cff]/10 rounded-lg">
            <Target className="w-5 h-5 text-[#573cff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Skill Level</p>
            <p className="font-semibold capitalize">{match.skill_level || 'All Levels'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchInfo;