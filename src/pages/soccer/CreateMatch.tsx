import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createMatch } from '../../services/matchService';
import MatchDetailsStep from './forms/steps/MatchDetailsStep';
import ScheduleStep from './forms/steps/ScheduleStep';
import VenueStep from './forms/steps/VenueStep';
import ConfirmStep from './forms/steps/ConfirmStep';
import StepIndicator from './forms/StepIndicator';

const STEPS = [
  { id: 1, label: 'Match Details' },
  { id: 2, label: 'Schedule' },
  { id: 3, label: 'Venue' },
  { id: 4, label: 'Confirm' }
];

const CreateMatch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    players_per_team: 0,
    gender_preference: '',
    skill_level: '',
    date: '',
    time: '',
    duration: 0,
    venue_id: '',
    description: '',
    status: 'open',
    restrictions: {
      age: 'none',
      minAge: undefined,
      maxAge: undefined,
      teamBalancing: true,
      gender: 'mixed',
      skillLevel: ['all']
    }
  });

  const handleFormChange = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/soccer/play');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const match = await createMatch(formData);
      navigate(`/soccer/match/${match.id}`);
    } catch (err) {
      console.error('Error creating match:', err);
      setError(err instanceof Error ? err.message : 'Failed to create match');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">Create Match</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>

          {currentStep < STEPS.length && (
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
      </div>
    </div>
  );
};

export default CreateMatch;