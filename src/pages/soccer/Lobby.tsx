import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Copy, Settings, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LobbyCard from '../../components/soccer/lobby/LobbyCard';
import AddPlayerModal from '../../components/soccer/lobby/AddPlayerModal';

const MAX_PLAYERS = 5;

const Lobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    initializeLobby();
  }, []);

  const initializeLobby = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profile);

      // Generate lobby code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setLobbyCode(code);

      // Add host to players
      setPlayers([{ ...profile, isHost: true, isReady: false }]);
    } catch (err) {
      console.error('Error initializing lobby:', err);
      setError('Failed to initialize lobby');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = (player: any) => {
    if (players.length >= MAX_PLAYERS) {
      setError('Maximum players reached');
      return;
    }

    if (players.some(p => p.id === player.id)) {
      setError('Player already in lobby');
      return;
    }

    setPlayers(prev => [...prev, { ...player, isReady: false }]);
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
  };

  const startMatch = async () => {
    // TODO: Implement match creation and start logic
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#573cff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/soccer')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">Lobby</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Lobby Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isPrivate ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isPrivate ? 'Private Lobby' : 'Public Lobby'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Lobby Code:</span>
              <code className="px-3 py-1 rounded bg-gray-800 font-mono">
                {lobbyCode}
              </code>
              <button
                onClick={copyLobbyCode}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-6 py-2"
              disabled={players.length >= MAX_PLAYERS}
            >
              <Plus className="w-5 h-5" />
              <span className="ml-2">Add Player</span>
            </button>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-5 gap-8 mb-12">
          {players.map((player) => (
            <LobbyCard
              key={player.id}
              profile={player}
              isHost={player.isHost}
              isReady={player.isReady}
              onRemove={player.isHost ? undefined : () => handleRemovePlayer(player.id)}
            />
          ))}

          {/* Empty Slots */}
          {Array.from({ length: MAX_PLAYERS - players.length }).map((_, i) => (
            <motion.div
              key={`empty-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="w-[200px] h-[356px] rounded-lg border-2 border-dashed border-gray-800 flex items-center justify-center cursor-pointer hover:border-gray-700 transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <div className="text-center text-gray-600">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span>Add Player</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/soccer')}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors"
          >
            Leave Lobby
          </button>
          <button
            onClick={startMatch}
            disabled={players.length < 2}
            className="px-12 py-3 bg-[#573cff] hover:bg-[#573cff]/80 rounded font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Match
          </button>
        </div>
      </div>

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPlayer={handleAddPlayer}
      />
    </div>
  );
};

export default Lobby;