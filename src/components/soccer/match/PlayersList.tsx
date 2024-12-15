import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlayersListProps {
  players: any[];
  totalSlots: number;
  showPrivate: boolean;
  isAuthenticated: boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({ 
  players, 
  totalSlots, 
  showPrivate,
  isAuthenticated 
}) => {
  const navigate = useNavigate();

  if (!showPrivate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Lock className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Private Players List</h3>
          <p className="text-gray-400">
            The players list for this match is private and only visible to match participants
          </p>
        </div>
      </motion.div>
    );
  }

  const homeTeamPlayers = players.filter(p => p.team === 'home');
  const awayTeamPlayers = players.filter(p => p.team === 'away');

  const renderTeam = (teamPlayers: any[], teamName: string) => (
    <div>
      <h4 className="font-semibold mb-3">{teamName} Team</h4>
      <div className="space-y-3">
        {teamPlayers.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50"
          >
            {player.player?.profile_picture_url ? (
              <img
                src={player.player.profile_picture_url}
                alt={player.player?.name || 'Player'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div>
              <span>{player.player?.name || 'Anonymous Player'}</span>
              {player.status === 'ready' && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full">
                  Ready
                </span>
              )}
            </div>
          </div>
        ))}
        {Array.from({ length: (totalSlots / 2) - teamPlayers.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-gray-500">Open Slot</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-6"
    >
      <h3 className="font-semibold mb-6">Players</h3>

      <div className="space-y-6">
        {renderTeam(homeTeamPlayers, 'Home')}
        <div className="border-t border-gray-800" />
        {renderTeam(awayTeamPlayers, 'Away')}
      </div>
    </motion.div>
  );
};

export default PlayersList;