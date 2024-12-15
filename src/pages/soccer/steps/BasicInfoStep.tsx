import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileImage from '../../../components/ProfileImage';

interface BasicInfoStepProps {
  formData: {
    bio: string;
    alias: string;
    profile_picture_url: string;
  };
  onChange: (field: string, value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onChange,
  onValidityChange
}) => {
  useEffect(() => {
    // Bio is optional, but alias is required
    const isValid = formData.bio.length <= 500 && formData.alias.trim().length > 0;
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
        <p className="text-gray-400">Tell us about yourself as a player</p>
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
          Player Alias
        </label>
        <input
          type="text"
          value={formData.alias}
          onChange={(e) => onChange('alias', e.target.value)}
          placeholder="Enter your player alias"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
        <p className="text-sm text-gray-400 mt-1">
          This is how other players will see you in matches and tournaments
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Tell us about yourself as a player..."
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

export default BasicInfoStep;