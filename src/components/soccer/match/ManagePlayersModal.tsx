import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, UserMinus, UserCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ManagePlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  players: any[];
  onUpdate: () => void;
}

const ManagePlayersModal: React.FC<ManagePlayersModalProps> = ({
  isOpen,
  onClose,
  match,
  players,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemovePlayer = async (playerId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: removeError } = await supabase
        .from('match_players')
        .delete()
        .eq('match_id', match.id)
        .eq('player_id', playerId);

      if (removeError) throw removeError;

      onUpdate();
    } catch (err) {
      console.error('Error removing player:', err);
      setError('Failed to remove player');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReady = async (playerId: string, currentStatus: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('match_players')
        .update({ status: currentStatus === 'ready' ? 'joined' : 'ready' })
        .eq('match_id', match.id)
        .eq('player_id', playerId);

      if (updateError) throw updateError;

      onUpdate();
    } catch (err) {
      console.error('Error updating player status:', err);
      setError('Failed to update player status');
    } finally {
      setLoading(false);
    }
  };

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
            className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#573cff]" />
              <h2 className="text-xl font-bold">Manage Players</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    {player.player?.profile_picture_url ? (
                      <img
                        src={player.player.profile_picture_url}
                        alt={player.player?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{player.player?.name || 'Anonymous Player'}</p>
                      <p className="text-sm text-gray-400 capitalize">{player.team} Team</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReady(player.player_id, player.status)}
                      disabled={loading}
                      className={`p-2 rounded-lg transition-colors ${
                        player.status === 'ready'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemovePlayer(player.player_id)}
                      disabled={loading}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-red-500 transition-colors"
                    >
                      <UserMinus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {players.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No players have joined this match yet
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManagePlayersModal;