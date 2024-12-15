import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot } from 'lucide-react';

interface CreateProfileProps {
  onCreateProfile: () => Promise<void>;
}

export const CreateProfile: React.FC<CreateProfileProps> = ({ onCreateProfile }) => {
  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <CircleDot className="w-16 h-16 mx-auto mb-6 text-[#573cff]" />
        <h2 className="text-2xl font-bold mb-4">Welcome to Soccer Hub!</h2>
        <p className="text-gray-400 mb-8">
          Create your player profile to start organizing matches, joining teams, and tracking your progress.
        </p>
        <button onClick={onCreateProfile} className="btn-primary">
          Create Player Profile
        </button>
      </motion.div>
    </div>
  );
};