import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CircleDot, Trophy, Activity, Dumbbell } from 'lucide-react';

interface HubProfilesRowProps {
  hubs: any[];
}

const HubProfilesRow: React.FC<HubProfilesRowProps> = ({ hubs }) => {
  const getHubIcon = (hubName: string) => {
    switch (hubName) {
      case 'soccer':
        return CircleDot;
      case 'basketball':
        return Trophy;
      case 'fitness':
        return Dumbbell;
      default:
        return Activity;
    }
  };

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {hubs.map((hub) => {
          const Icon = getHubIcon(hub.hub.name);
          return (
            <Link
              key={hub.id}
              to={`/${hub.hub.name}/profile`}
              className="flex-shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#573cff] p-1 mb-2">
                  {hub.profile_picture_url ? (
                    <img
                      src={hub.profile_picture_url}
                      alt={hub.hub.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#573cff]" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {hub.hub.display_name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HubProfilesRow;