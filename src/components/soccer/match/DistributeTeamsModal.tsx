import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shuffle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface DistributeTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  players: any[];
  onUpdate: () => void;
}

const DistributeTeamsModal: React.FC<DistributeTeamsModalProps> = ({
  isOpen,
  onClose,
  match,
  players,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shufflePlayers = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const halfLength = Math.ceil(shuffled.length / 2);
    
    return {
      home: shuffled.slice(0, halfLength),
      away: shuffled.slice(halfLength)
    };
  };

  const handleRandomize = async () => {
    try {
      setLoading(true);
      setError(null);

      const { home, away } = shufflePlayers();

      // Update team assignments
      for (const player of [...home, ...away]) {
        const { error: updateError } = await supabase
          .from('match_players')
          .update({ 
            team: home.includes(player) ? 'home' : 'away',
            status: 'joined' // Reset ready status
          })
          .eq('match_id', match.id)
          .eq('player_id', player.player_id);

        if (updateError) throw updateError;
      }

      onUpdate();
    } catch (err) {
      console.error('Error distributing teams:', err);
      setError('Failed to distribute teams');
    } finally {
      setLoading(false);
    }
  };

  const handleMovePlayer = async (playerId: string, toTeam: 'home' | 'away') => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('match_players')
        .update({ 
          team: toTeam,
          status: 'joined' // Reset ready status
        })
        .eq('match_id', match.id)
        .eq('player_id', playerId);

      if (updateError) throw updateError;

      onUpdate();
    } catch (err) {
      console.error('Error moving player:', err);
      setError('Failed to move player');
    } finally {
      setLoading(false);
    }
  };

  const homePlayers = players.filter(p => p.team === 'home');
  const awayPlayers = players.filter(p => p.team === 'away');

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-[#573cff]" />
                <h2 className="text-xl font-bold">Distribute Teams</h2>
              </div>

              <button
                onClick={handleRandomize}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#573cff] hover:bg-[#573cff]/80 transition-colors disabled:opacity-50"
              >
                <Shuffle className="w-5 h-5" />
                <span>Randomize</span>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {/* Home Team */}
              <div>
                <h3 className="font-semibold mb-4">Home Team</h3>
                <div className="space-y-3">
                  {homePlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        {player.player?.profile_picture_url ? (
                          <img
                            src={player.player.profile_picture_url}
                            alt={player.player?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span>{player.player?.name || 'Anonymous Player'}</span>
                      </div>
                      <button
                        onClick={() => handleMovePlayer(player.player_id, 'away')}
                        disabled={loading}
                        className="text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        Move to Away
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Team */}
              <div>
                <h3 className="font-semibold mb-4">Away Team</h3>
                <div className="space-y-3">
                  {awayPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        {player.player?.profile_picture_url ? (
                          <img
                            src={player.player.profile_picture_url}
                            alt={player.player?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span>{player.player?.name || 'Anonymous Player'}</span>
                      </div>
                      <button
                        onClick={() => handleMovePlayer(player.player_id, 'home')}
                        disabled={loading}
                        className="text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        Move to Home
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DistributeTeamsModal;