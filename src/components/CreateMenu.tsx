import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar,
  Trophy,
  Clock,
  X,
  Route
} from 'lucide-react';

const CreateMenu = ({ isOpen, onClose, onSelect }) => {
  const menuItems = [
    {
      id: 'activity',
      label: 'Create Activity',
      description: 'Schedule a one-time activity or event',
      icon: Calendar,
      color: 'text-purple-500'
    },
    {
      id: 'event',
      label: 'Create Event',
      description: 'Organize a tournament or competition',
      icon: Trophy,
      color: 'text-blue-500'
    },
    {
      id: 'routine',
      label: 'Start Routine',
      description: 'Set up a recurring activity schedule',
      icon: Clock,
      color: 'text-green-500'
    },
    {
      id: 'itinerary',
      label: 'Build Itinerary',
      description: 'Plan a sequence of activities',
      icon: Route,
      color: 'text-orange-500'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Create New</h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelect(item.id);
                        onClose();
                      }}
                      className="w-full p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left flex items-start gap-4"
                    >
                      <div className="p-2 rounded-lg bg-gray-900">
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateMenu;