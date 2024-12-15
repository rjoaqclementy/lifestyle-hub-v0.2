import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface SportsProfileFormProps {
  userId: string;
  hubId: string;
  onUpdate?: () => void;
}

interface SportSpecificData {
  positions: string[];
  preferred_foot: string;
  playing_style: string[];
  specialties: string[];
}

interface ProfileData {
  bio: string;
  skill_level: string;
  years_experience: string;
  sport_specific_data: SportSpecificData;
}

const SportsProfileForm: React.FC<SportsProfileFormProps> = ({ userId, hubId, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    skill_level: '',
    years_experience: '',
    sport_specific_data: {
      positions: [],
      preferred_foot: '',
      playing_style: [],
      specialties: []
    }
  });

  useEffect(() => {
    fetchProfile();
  }, [userId, hubId]);

  const fetchProfile = async () => {
    try {
      // First get or create hub profile
      let { data: hubProfile, error: hubError } = await supabase
        .from('hub_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('hub_id', hubId)
        .single();

      if (hubError && hubError.code !== 'PGRST116') throw hubError;

      if (!hubProfile) {
        const { data: newHubProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert([{ 
            user_id: userId, 
            hub_id: hubId,
            bio: ''
          }])
          .select()
          .single();

        if (createError) throw createError;
        hubProfile = newHubProfile;
      }

      // Then get sports profile
      const { data: sportsProfile, error: sportsError } = await supabase
        .from('sports_player_profiles')
        .select('*')
        .eq('hub_profile_id', hubProfile.id)
        .single();

      if (sportsError && sportsError.code !== 'PGRST116') throw sportsError;

      setProfile({
        bio: hubProfile.bio || '',
        skill_level: sportsProfile?.skill_level || '',
        years_experience: sportsProfile?.years_experience || '',
        sport_specific_data: sportsProfile?.sport_specific_data || {
          positions: [],
          preferred_foot: '',
          playing_style: [],
          specialties: []
        }
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get or create hub profile
      let { data: hubProfile, error: hubError } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', userId)
        .eq('hub_id', hubId)
        .single();

      if (hubError && hubError.code !== 'PGRST116') throw hubError;

      if (!hubProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert([{ 
            user_id: userId, 
            hub_id: hubId,
            bio: profile.bio 
          }])
          .select()
          .single();

        if (createError) throw createError;
        hubProfile = newProfile;
      } else {
        // Update hub profile bio
        const { error: updateError } = await supabase
          .from('hub_profiles')
          .update({ bio: profile.bio })
          .eq('id', hubProfile.id);

        if (updateError) throw updateError;
      }

      // Update or create sports profile
      const { error: sportsError } = await supabase
        .from('sports_player_profiles')
        .upsert({
          hub_profile_id: hubProfile.id,
          sport_type: 'soccer',
          skill_level: profile.skill_level,
          years_experience: profile.years_experience,
          sport_specific_data: profile.sport_specific_data
        });

      if (sportsError) throw sportsError;

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 min-h-[100px]"
            placeholder="Tell us about yourself as a player..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Skill Level</label>
          <select
            value={profile.skill_level}
            onChange={(e) => setProfile({ ...profile, skill_level: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="">Select skill level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Years of Experience</label>
          <select
            value={profile.years_experience}
            onChange={(e) => setProfile({ ...profile, years_experience: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="">Select experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Foot</label>
          <select
            value={profile.sport_specific_data.preferred_foot}
            onChange={(e) => setProfile({
              ...profile,
              sport_specific_data: {
                ...profile.sport_specific_data,
                preferred_foot: e.target.value
              }
            })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="">Select preferred foot</option>
            <option value="right">Right</option>
            <option value="left">Left</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </motion.form>
  );
};

export default SportsProfileForm;