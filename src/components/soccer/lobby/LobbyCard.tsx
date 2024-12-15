import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, MessageSquare, UserMinus, Trophy, Clock } from 'lucide-react';
import PlayerCard from './PlayerCard';

const LobbyCard = ({
  profile,
  isHost = false,
  isReady = false,
  onRemove,
  onToggleReady
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-[160px]"
      onContextMenu={handleContextMenu}
      onClick={handleContextMenu}
    >
      {/* Main Card */}
      <div className="relative rounded-t-lg overflow-hidden">
        <div className={`absolute inset-0 rounded-t-lg border-2 ${
          isHost ? 'border-yellow-500/30' : 'border-gray-700/50'
        }`} />
        <PlayerCard profile={profile} onUpdate={() => {}} editable={false} />
      </div>

      {/* Info Banner */}
      <div className="bg-gray-900/95 backdrop-blur-sm px-3 py-2 rounded-b-lg border-x border-b border-gray-800">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-bold text-white">{profile.name}</span>
            {isHost && (
              <Crown className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <div className="text-xs text-gray-400">
            <span>{profile.skill_level || 'Beginner'}</span>
            <span className="mx-1">•</span>
            <span>{profile.years_experience || '0-1'} YRS</span>
          </div>
        </div>

        {/* Status Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleReady?.();
          }}
          className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
            isReady 
              ? 'bg-green-500/20 border-green-500/30 text-green-500 hover:bg-green-500/30' 
              : 'bg-gray-800/50 border-gray-700/30 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          {isReady ? 'READY' : 'NOT READY'}
        </button>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden z-50 shadow-xl"
          >
            <div className="divide-y divide-gray-800">
              <ContextMenuItem 
                icon={MessageSquare} 
                label="Send Message"
                onClick={() => setShowContextMenu(false)}
              />
              <ContextMenuItem 
                icon={Trophy} 
                label="View Career"
                onClick={() => setShowContextMenu(false)}
              />
              <ContextMenuItem 
                icon={Clock} 
                label="Match History"
                onClick={() => setShowContextMenu(false)}
              />
              {!isHost && onRemove && (
                <ContextMenuItem 
                  icon={UserMinus} 
                  label="Remove Player"
                  onClick={() => {
                    onRemove();
                    setShowContextMenu(false);
                  }}
                  className="text-red-400 hover:bg-red-500/10"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showContextMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowContextMenu(false)}
        />
      )}
    </motion.div>
  );
};

const ContextMenuItem = ({ 
  icon: Icon, 
  label, 
  onClick,
  className = "hover:bg-gray-800/50"
}) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors ${className}`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export default LobbyCard;