import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Activity, Settings } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: any;
  isOwnProfile: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  profile,
  isOwnProfile
}) => {
  const tabs = [
    { id: 'hubs', label: 'Hub Activity', icon: Grid },
    { id: 'activity', label: 'Recent Activity', icon: Activity },
    ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: Settings }] : [])
  ];

  return (
    <div className="border-t border-gray-800">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 relative
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#573cff]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'hubs' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Hub activity content */}
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {/* Recent activity content */}
          </div>
        )}

        {activeTab === 'settings' && isOwnProfile && (
          <div className="space-y-6">
            {/* Settings content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;