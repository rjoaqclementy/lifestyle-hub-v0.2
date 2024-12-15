import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileImage from '../../ProfileImage';

interface ProfileStepProps {
  formData: {
    bio: string;
    profile_picture_url: string;
  };
  onChange: (field: string, value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({
  formData,
  onChange,
  onValidityChange,
}) => {
  useEffect(() => {
    // Bio is optional, profile is valid as long as it's not too long
    const isValid = formData.bio.length <= 500;
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  return (
    <motion.div
      key="profile-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
        <p className="text-gray-400">Add a profile picture and bio to help others get to know you</p>
      </div>

      <div className="flex justify-center mb-8">
        <ProfileImage
          url={formData.profile_picture_url}
          onUpload={(url) => onChange('profile_picture_url', url)}
          size={120}
          editable={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
        <p className="text-sm text-gray-400 mt-2">
          {formData.bio.length}/500 characters
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileStep;