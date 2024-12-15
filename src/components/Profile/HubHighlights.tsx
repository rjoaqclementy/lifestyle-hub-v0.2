import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface HubHighlightsProps {
  hubProfiles: any[];
}

const HubHighlights: React.FC<HubHighlightsProps> = ({ hubProfiles }) => {
  if (!hubProfiles?.length) return null;

  return (
    <div className="border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Hub Profiles</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {hubProfiles.map((hub) => (
            <Link
              key={hub.id}
              to={`/${hub.hub.name}/profile`}
              className="flex-shrink-0 group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-[#573cff] to-purple-500"
              >
                <div className="w-full h-full rounded-full border-2 border-gray-900 overflow-hidden">
                  {hub.profile_picture_url ? (
                    <img
                      src={hub.profile_picture_url}
                      alt={hub.hub.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
              </motion.div>
              <p className="mt-1 text-xs text-center text-gray-400 group-hover:text-white transition-colors">
                {hub.hub.display_name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubHighlights;