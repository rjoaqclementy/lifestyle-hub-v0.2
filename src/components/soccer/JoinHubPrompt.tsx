import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JoinHubPromptProps {
  onComplete: () => void;
}

const JoinHubPrompt: React.FC<JoinHubPromptProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
      >
        <div className="w-20 h-20 bg-[#573cff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CircleDot className="w-10 h-10 text-[#573cff]" />
        </div>

        <h2 className="text-3xl font-bold mb-4">Join Soccer Hub</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Create your Soccer Hub profile to join matches, participate in tournaments, and connect with other players in your area.
        </p>

        <div className="grid gap-4 max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/soccer/join')}
            className="w-full flex items-center justify-between bg-[#573cff] hover:bg-[#573cff]/80 text-white p-4 rounded-lg shadow-lg transition-all duration-300"
          >
            <span className="text-lg font-bold">Create Soccer Profile</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="text-sm text-gray-400">
            Already have a profile?{' '}
            <button
              onClick={() => navigate('/soccer/profile')}
              className="text-[#573cff] hover:underline"
            >
              View Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-2">Join Matches</h3>
          <p className="text-gray-400">
            Find and join soccer matches in your area, or create your own and invite others to play.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-400">
            Keep track of your matches, stats, and achievements as you improve your game.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-2">Connect & Compete</h3>
          <p className="text-gray-400">
            Join teams, participate in tournaments, and connect with other players.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinHubPrompt;