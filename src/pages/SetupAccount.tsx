import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PersonalInfoStep from '../components/auth/steps/PersonalInfoStep';
import HometownStep from '../components/auth/steps/HometownStep';
import InterestsStep from '../components/auth/steps/InterestsStep';
import ProfileStep from '../components/auth/steps/ProfileStep';
import StepIndicator from '../components/auth/StepIndicator';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Hometown' },
  { id: 3, label: 'Interests' },
  { id: 4, label: 'Profile' },
];

const SetupAccount = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    hometown: '',
    current_city: '',
    interests: [],
    bio: '',
    profile_picture_url: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user has already completed setup
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_completed) {
      navigate('/');
      return;
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValidityChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleNext = async () => {
    if (!isValid) return;

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setIsValid(false);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Update profile with all collected data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            birthday: formData.birthday,
            gender: formData.gender,
            city: formData.hometown,
            current_city: formData.current_city,
            interests: formData.interests,
            bio: formData.bio,
            profile_picture_url: formData.profile_picture_url,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        // Refresh the session to ensure the latest profile data is available
        await supabase.auth.refreshSession();

        // Redirect to home page
        window.location.href = '/';
      } catch (err) {
        console.error('Error completing setup:', err);
        setError('Failed to complete account setup');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsValid(true);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      case 2:
        return (
          <HometownStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      case 3:
        return (
          <InterestsStep
            formData={formData}
            onChange={handleChange}
            onValidityChange={handleValidityChange}
          />
        );
      case 4:
        return (
          <ProfileStep
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
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Setup Your Account</h1>
            <p className="text-gray-400">Complete your profile to get started</p>
          </div>

          <StepIndicator steps={steps} currentStep={currentStep} />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

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
                disabled={!isValid}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isValid
                    ? 'bg-[#573cff] hover:bg-[#573cff]/80 text-white'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length ? 'Complete Setup' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SetupAccount;