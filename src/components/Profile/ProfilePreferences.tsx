import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, Eye } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface ProfilePreferencesProps {
  profile: any;
  onProfileUpdate: (updatedProfile: any) => void;
}

const ProfilePreferences = ({ profile, onProfileUpdate }: ProfilePreferencesProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card space-y-4"
      >
        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
        
        <div className="space-y-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </div>
            <span className="text-sm text-gray-400">
              {profile.preferences?.notifications_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5" />
              <span>Privacy</span>
            </div>
            <span className="text-sm text-gray-400">
              {profile.is_public ? 'Public' : 'Private'}
            </span>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5" />
              <span>Profile Visibility</span>
            </div>
            <span className="text-sm text-gray-400">
              {profile.is_public ? 'Everyone' : 'Friends Only'}
            </span>
          </button>
        </div>
      </motion.div>

      <EditProfileModal
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onProfileUpdate}
      />
    </>
  );
};

export default ProfilePreferences;