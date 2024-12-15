import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, Shield, Edit2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface AdminControlsProps {
  isAdmin: boolean;
  match: any;
  onEditMatch: () => void;
  onManagePlayers: () => void;
  onDistributeTeams: () => void;
  onUpdate: () => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  isAdmin,
  match,
  onEditMatch,
  onManagePlayers,
  onDistributeTeams,
  onUpdate
}) => {
  const togglePlayersListVisibility = async () => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ players_list_public: !match.players_list_public })
        .eq('id', match.id);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error updating players list visibility:', error);
    }
  };

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#573cff]" />
          <h3 className="font-semibold">Organizer Controls</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={onEditMatch}
          className="flex items-center gap-2 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Edit2 className="w-5 h-5" />
          <span>Edit Match</span>
        </button>

        <button
          onClick={onManagePlayers}
          className="flex items-center gap-2 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span>Manage Players</span>
        </button>

        <button
          onClick={onDistributeTeams}
          className="flex items-center gap-2 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Distribute Teams</span>
        </button>

        <button
          onClick={togglePlayersListVisibility}
          className={`flex items-center gap-2 p-4 rounded-lg transition-colors ${
            match.players_list_public
              ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
              : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
          }`}
        >
          {match.players_list_public ? (
            <>
              <Eye className="w-5 h-5" />
              <span>Players List Public</span>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5" />
              <span>Players List Private</span>
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-400">
        {match.players_list_public ? (
          <p className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Players list is visible to everyone
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            Players list is only visible to match participants
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminControls;