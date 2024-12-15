import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Swords } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfileImage from '../ProfileImage';

const steps = [
  { id: 'basic', title: 'Basic Info', icon: User },
  { id: 'preferences', title: 'Playing Preferences', icon: Swords },
  { id: 'experience', title: 'Experience', icon: Award },
];

const positions = [
  'Goalkeeper',
  'Center Back',
  'Full Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Attacking Midfielder',
  'Winger',
  'Forward',
  'Striker'
];

const matchTypes = [
  '5-a-side',
  '7-a-side',
  '11-a-side',
  'Casual Pickup',
  'Competitive League'
];

interface CreateSoccerProfileProps {
  hubId: string;
  onComplete: (profile: any) => void;
}

export const CreateSoccerProfile: React.FC<CreateSoccerProfileProps> = ({ hubId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    preferred_position: '',
    skill_level: '',
    years_experience: '',
    profile_picture_url: '',
    preferences: {
      best_foot: '',
      field_positions: [],
      preferred_times: [],
      preferred_match_types: [],
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: prev.preferences[field].includes(value)
          ? prev.preferences[field].filter(item => item !== value)
          : [...prev.preferences[field], value]
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // First create or get hub profile
      let hubProfile;
      const { data: existingProfile, error: profileError } = await supabase
        .from('hub_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('hub_id', hubId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Create new hub profile
        const { data: newProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert({
            user_id: user.id,
            hub_id: hubId,
            bio: formData.bio,
            profile_picture_url: formData.profile_picture_url
          })
          .select()
          .single();

        if (createError) throw createError;
        hubProfile = newProfile;
      } else if (profileError) {
        throw profileError;
      } else {
        hubProfile = existingProfile;
      }

      // Then create sports profile
      const { data: sportsProfile, error: sportsError } = await supabase
        .from('sports_player_profiles')
        .insert({
          hub_profile_id: hubProfile.id,
          sport_type: 'soccer',
          skill_level: formData.skill_level,
          years_experience: formData.years_experience,
          sport_specific_data: {
            positions: formData.preferences.field_positions,
            preferred_foot: formData.preferences.best_foot,
            playing_style: [],
            specialties: []
          },
          preferences: {
            match_types: formData.preferences.preferred_match_types,
            times: formData.preferences.preferred_times
          }
        })
        .select()
        .single();

      if (sportsError) throw sportsError;

      onComplete({ ...hubProfile, ...sportsProfile });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <ProfileImage
                url={formData.profile_picture_url}
                onUpload={(url) => setFormData(prev => ({ ...prev, profile_picture_url: url }))}
                size={120}
                editable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself as a player..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Preferred Position
              </label>
              <select
                name="preferred_position"
                value={formData.preferred_position}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
              >
                <option value="">Select position</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Best Foot
              </label>
              <select
                name="preferences.best_foot"
                value={formData.preferences.best_foot}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
              >
                <option value="">Select foot</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Field Positions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {positions.map(position => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handleMultiSelect('field_positions', position)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      formData.preferences.field_positions.includes(position)
                        ? 'bg-[#573cff] text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Preferred Match Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {matchTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleMultiSelect('preferred_match_types', type)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      formData.preferences.preferred_match_types.includes(type)
                        ? 'bg-[#573cff] text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Skill Level
              </label>
              <select
                name="skill_level"
                value={formData.skill_level}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Years of Experience
              </label>
              <select
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
              >
                <option value="">Select experience</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">More than 5 years</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = steps.findIndex(s => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isActive || isPast
                          ? 'bg-[#573cff] text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === steps[0].id}
              className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps[steps.length - 1].id ? (
                loading ? 'Creating Profile...' : 'Complete'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSoccerProfile;