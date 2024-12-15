import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Clock, Trophy } from 'lucide-react';

interface Match {
  id: string;
  type: string;
  date: string;
  time: string;
  players_per_team: number;
  gender_preference: string;
  skill_level: string;
  venue_id: string;
  creator: {
    name: string;
    profile_picture_url?: string;
  };
  venue: {
    name: string;
    address: string;
  };
  players: any[];
}

interface MatchListProps {
  matches: Match[];
  loading?: boolean;
}

const MatchList: React.FC<MatchListProps> = ({ matches, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="card p-8 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">No Matches Available</h3>
        <p className="text-gray-400">
          There are no matches scheduled at the moment. Why not create one?
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {matches.map((match) => (
        <motion.div
          key={match.id}
          whileHover={{ scale: 1.02 }}
          className="card p-6 cursor-pointer hover:border-[#573cff]/50 transition-colors"
          onClick={() => navigate(`/soccer/match/${match.id}`)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {match.creator.profile_picture_url ? (
                <img
                  src={match.creator.profile_picture_url}
                  alt={match.creator.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{match.creator.name}</h3>
                <p className="text-sm text-gray-400">
                  {match.type} • {match.players_per_team}v{match.players_per_team}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                match.skill_level === 'all'
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-[#573cff]/20 text-[#573cff]'
              }`}>
                {match.skill_level === 'all' ? 'All Levels' : match.skill_level}
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm capitalize">
                {match.gender_preference}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(match.date).toLocaleDateString()} at {match.time.slice(0, 5)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{match.venue.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>
                {match.players.length}/{match.players_per_team * 2} players
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchList;