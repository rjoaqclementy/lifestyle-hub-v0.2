import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import ProfileBioForm from './forms/ProfileBioForm';
import PlayerDetailsForm from './forms/PlayerDetailsForm';

interface EditSoccerProfileProps {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
}

const EditSoccerProfile: React.FC<EditSoccerProfileProps> = ({ profile, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      await onUpdate(updatedData);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Bio Form */}
        <div>
          <ProfileBioForm
            profile={profile}
            onUpdate={handleUpdateProfile}
            loading={loading}
          />
        </div>

        {/* Player Details Form */}
        <div>
          <PlayerDetailsForm
            profile={profile}
            onUpdate={handleUpdateProfile}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSoccerProfile;