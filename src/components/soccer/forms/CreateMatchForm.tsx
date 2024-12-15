import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MatchRestrictions, GenderRestriction } from '../../../types/match';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import MatchDetailsStep from './steps/MatchDetailsStep';
import ScheduleStep from './steps/ScheduleStep';
import VenueStep from './steps/VenueStep';
import ConfirmStep from './steps/ConfirmStep';
import MatchRestrictionsForm from '../match/MatchRestrictionsForm';

const STEPS = [
  { id: 1, label: 'Match Details' },
  { id: 2, label: 'Schedule' },
  { id: 3, label: 'Venue' },
  { id: 4, label: 'Confirm' }
];

const CreateMatchForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'casual',
    players_per_team: 5,
    gender_preference: 'mixed' as GenderRestriction,
    skill_level: 'all',
    date: '',
    time: '',
    duration: 60,
    venue_id: '',
    description: '',
    status: 'open',
    restrictions: {
      gender: 'mixed',
      age: 'none',
      skillLevel: ['all'],
      maxPlayers: 14,
      teamBalancing: true
    } as MatchRestrictions
  });
  const handleFormChange = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    // Update restrictions when gender preference changes
    if (data.gender_preference) {
      const genderRestriction = data.gender_preference === 'mixed' ? 'mixed' : 
        data.gender_preference === 'men' ? 'men-only' : 
        data.gender_preference === 'women' ? 'women-only' : 'mixed';
      
      setFormData(prev => ({
        ...prev,
        restrictions: {
          ...prev.restrictions,
          gender: genderRestriction
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS[STEPS.length - 1].id) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: hubProfile } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', '088aea9b-719f-40f5-b0e4-375e62be623a')
        .single();

      if (!hubProfile) {
        console.error('No hub profile found');
        return;
      }

      // Calculate max players based on players per team
      const maxPlayers = formData.players_per_team * 2;

      // Prepare match data
      const matchData = {
        ...formData,
        restrictions: {
          ...formData.restrictions,
          maxPlayers
        },
        creator_id: hubProfile.id,
        hub_id: '088aea9b-719f-40f5-b0e4-375e62be623a'
      };
      const { data: match, error } = await supabase
        .from('matches')
        .insert(matchData)
        .select()
        .single();

      if (error) throw error;

      onClose();
      navigate(`/soccer/match/${match.id}`);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MatchDetailsStep
            formData={formData}
            onChange={handleFormChange}
          />
        );
      case 2:
        return (
          <ScheduleStep
            formData={formData}
            onChange={handleFormChange}
          />
        );
      case 3:
        return (
          <VenueStep
            formData={formData}
            onChange={handleFormChange}
          />
        );
      case 4:
        return (
          <ConfirmStep
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} steps={STEPS} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>

      {currentStep < STEPS[STEPS.length - 1].id && (
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            disabled={currentStep === 1}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#573cff] hover:bg-[#573cff]/80 text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateMatchForm;