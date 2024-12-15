import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingActionButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-[#573cff] hover:bg-[#573cff]/90 
        text-white flex items-center justify-center shadow-lg cursor-pointer z-50
        transition-colors"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
};

export default FloatingActionButton;