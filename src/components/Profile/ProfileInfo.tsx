import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, MapPin, Cake, User2 } from 'lucide-react';

const ProfileInfo = ({ profile }: { profile: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card space-y-4"
    >
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      
      <div className="space-y-3">
        {profile.email && (
          <div className="flex items-center space-x-3 text-gray-300">
            <Mail className="w-5 h-5" />
            <span>{profile.email}</span>
          </div>
        )}
        
        {profile.birthday && (
          <div className="flex items-center space-x-3 text-gray-300">
            <Cake className="w-5 h-5" />
            <span>{new Date(profile.birthday).toLocaleDateString()}</span>
          </div>
        )}

        {(profile.city || profile.country) && (
          <div className="flex items-center space-x-3 text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {profile.gender && (
          <div className="flex items-center space-x-3 text-gray-300">
            <User2 className="w-5 h-5" />
            <span>{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</span>
          </div>
        )}

        <div className="flex items-center space-x-3 text-gray-300">
          <Calendar className="w-5 h-5" />
          <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {profile.interests && profile.interests.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest: string) => (
              <span 
                key={interest}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileInfo;