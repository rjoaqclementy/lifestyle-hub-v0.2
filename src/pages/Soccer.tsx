import React from 'react';
import { motion } from 'framer-motion';
import SoccerHub from '../components/soccer/SoccerHub';
import { useSoccerHub } from '../lib/hooks/useSoccerHub';

const Soccer = () => {
  const { hubId, loading, error } = useSoccerHub();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !hubId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Failed to load soccer hub</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900"
    >
      <SoccerHub hubId={hubId} />
    </motion.div>
  );
};

export default Soccer;