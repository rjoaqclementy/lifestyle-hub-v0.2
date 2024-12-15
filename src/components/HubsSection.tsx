// src/components/HubsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface Hub {
  id: string;
  name?: string;
  display_name?: string;
  description?: string;
  color?: string; // optional if you want dynamic colors
}

interface HubsSectionProps {
  hubs: Hub[];
  onHubClick: (hub: Hub) => void;
}

const HubsSection: React.FC<HubsSectionProps> = ({ hubs, onHubClick }) => {
  return (
    <section>
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
        Explore Hubs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hubs.map((hub) => (
          <motion.div
            key={hub.id}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden group cursor-pointer rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-[#573cff]/50 p-8 transition-all duration-300"
            onClick={() => onHubClick(hub)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 group-hover:opacity-15 transition-all duration-500`} />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#573cff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8 text-[#573cff]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{hub.display_name || hub.name}</h3>
              <p className="text-gray-400 mb-6 text-lg">{hub.description || 'No description'}</p>
              <button className="btn-primary group-hover:bg-[#573cff]/90 transition-colors duration-300">
                Enter Hub
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HubsSection;
