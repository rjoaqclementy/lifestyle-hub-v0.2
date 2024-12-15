import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Users, AlertCircle } from 'lucide-react';

interface JoinMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (team: string) => Promise<void>;
  match: any;
}

const JoinMatchModal: React.FC<JoinMatchModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  match
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onJoin(selectedTeam);
    } catch (err) {
      console.error('Error joining match:', err);
      setError(err instanceof Error ? err.message : 'Failed to join match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Join Match</h2>
              <p className="text-gray-400">
                {match.restrictions ? (
                  <>
                    {match.restrictions.gender === 'men-only' && 'This match is for men only. '}
                    {match.restrictions.gender === 'women-only' && 'This match is for women only. '}
                    {match.restrictions.gender === 'gender-ratio' && 'This match has gender ratio requirements. '}
                    {match.restrictions.age === 'under-18' && 'This match is for players under 18. '}
                    {match.restrictions.age === 'over-18' && 'This match is for players over 18. '}
                    {match.restrictions.age === 'custom' && match.restrictions.customAgeRange && 
                      `Age requirements: ${match.restrictions.customAgeRange.min || 0} - ${match.restrictions.customAgeRange.max || '∞'} years. `}
                  </>
                ) : (
                  `Choose your team to join this ${match.type} match`
                )}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedTeam('home')}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTeam === 'home'
                    ? 'border-[#573cff] bg-[#573cff]/10'
                    : 'border-gray-700 hover:border-[#573cff]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Home Team</h3>
                    <p className="text-sm text-gray-400">Join the home side</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedTeam('away')}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTeam === 'away'
                    ? 'border-[#573cff] bg-[#573cff]/10'
                    : 'border-gray-700 hover:border-[#573cff]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <h3 className="font-semibold">Away Team</h3>
                    <p className="text-sm text-gray-400">Join the away side</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={loading || !selectedTeam}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Match'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default JoinMatchModal;