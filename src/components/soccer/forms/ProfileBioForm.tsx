import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileImage from '../../ProfileImage';

interface ProfileBioFormProps {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
}

const ProfileBioForm: React.FC<ProfileBioFormProps> = ({ profile, onUpdate, loading }) => {
  const [bio, setBio] = useState(profile?.bio || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ bio });
  };

  const handleProfilePictureUpdate = async (url: string) => {
    await onUpdate({ profile_picture_url: url });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card relative overflow-hidden h-full"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#573cff] to-blue-500" />
      
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Bio</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <ProfileImage
              url={profile?.profile_picture_url}
              onUpload={handleProfilePictureUpdate}
              size={80}
              editable={true}
            />
            <div>
              <h3 className="text-lg font-semibold">
                {profile?.full_name || 'Your Name'}
              </h3>
              <p className="text-sm text-gray-400">
                {profile?.skill_level || 'Skill Level Not Set'} • {profile?.years_experience || 'Experience Not Set'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#573cff] focus:border-transparent transition-all duration-200 resize-none min-h-[120px]"
              placeholder="Tell us about yourself as a player..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? 'Saving...' : 'Save Bio'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#573cff] to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfileBioForm;