import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CircleDot, ArrowRight, Trophy, Users, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import StepIndicator from '../../components/soccer/forms/StepIndicator';
import BasicInfoStep from './steps/BasicInfoStep';
import PreferencesStep from './steps/PreferencesStep';
import ExperienceStep from './steps/ExperienceStep';
import PlayerCardStep from './steps/PlayerCardStep';

const steps = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Preferences' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Player Card' }
];

const JoinHub = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    alias: '',
    profile_picture_url: '',
    player_card_url: '',
    skill_level: '',
    years_experience: '',
    sport_specific_data: {
      positions: [],
      preferred_foot: '',
      playing_style: [],
      specialties: []
    }
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleValidityChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleNext = () => {
    if (!isValid) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setIsValid(false);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsValid(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.alias?.trim()) {
        throw new Error('Player alias is required');
      }

      if (!formData.skill_level) {
        throw new Error('Skill level is required');
      }

      if (!formData.years_experience) {
        throw new Error('Years of experience is required');
      }

      if (!formData.sport_specific_data.positions?.length) {
        throw new Error('Please select at least one position');
      }

      if (!formData.sport_specific_data.preferred_foot) {
        throw new Error('Preferred foot is required');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required. Please sign in.');
      }

      // Get soccer hub ID
      const { data: hubData, error: hubError } = await supabase
        .from('hubs')
        .select('id')
        .eq('name', 'soccer')
        .single();

      if (hubError) {
        console.error('Hub error:', hubError);
        throw new Error('Unable to access Soccer Hub. Please try again.');
      }

      // Check if hub profile exists
      const { data: hubProfile, error: profileError } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', hubData.id)
        .single();

      // Only throw error if it's not a "not found" error
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        throw new Error('Error checking profile status. Please try again.');
      }
      
      // Create or get hub profile
      let finalProfile = hubProfile;
      if (!finalProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert({
            user_id: user.id,
            hub_id: hubData.id,
            bio: formData.bio,
            alias: formData.alias,
            profile_picture_url: formData.profile_picture_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Create profile error:', createError);
          throw new Error('Unable to create profile. Please try again.');
        }
        finalProfile = newProfile;
      }

      // Create sports profile
      const { data: sportsProfile, error: sportsError } = await supabase
        .from('sports_player_profiles')
        .insert({
          hub_profile_id: finalProfile.id,
          sport_type: 'soccer',
          skill_level: formData.skill_level,
          years_experience: formData.years_experience,
          sport_specific_data: formData.sport_specific_data,
          player_card_url: formData.player_card_url || null,
          player_stats: {},
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sportsError) {
        console.error('Sports profile error:', sportsError);
        throw new Error('Unable to create sports profile. Please try again.');
      }

      navigate('/soccer/profile');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      case 2:
        return (
          <PreferencesStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      case 3:
        return (
          <ExperienceStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      case 4:
        return (
          <PlayerCardStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/soccer')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">Join Soccer Hub</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-[#573cff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CircleDot className="w-10 h-10 text-[#573cff]" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Create Your Soccer Profile</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Set up your player profile to join matches, participate in tournaments, and connect with other players.
            </p>
          </div>

          {/* Progress Steps */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="card p-6">
            {renderStep()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isValid || loading}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isValid && !loading
                    ? 'bg-[#573cff] hover:bg-[#573cff]/80 text-white'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Creating Profile...' : currentStep === steps.length ? 'Create Profile' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinHub;