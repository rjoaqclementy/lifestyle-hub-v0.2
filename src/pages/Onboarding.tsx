import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import SelectHubsStep from '../components/onboarding/SelectHubsStep';
import SetupProfileStep from '../components/onboarding/SetupProfileStep';
import CompleteStep from '../components/onboarding/CompleteStep';

type OnboardingStep = 'welcome' | 'select-hubs' | 'setup-profile' | 'complete';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate('/');
          return;
        }

        setUser(user);
        setProfile(profile);
        setCurrentStep(profile?.onboarding_step || 'welcome');
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const updateStep = async (step: OnboardingStep) => {
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_step: step })
        .eq('id', user.id);

      setCurrentStep(step);
    } catch (error) {
      console.error('Error updating step:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_step: 'complete'
        })
        .eq('id', user.id);

      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep
            profile={profile}
            onNext={() => updateStep('select-hubs')}
          />
        );
      case 'select-hubs':
        return (
          <SelectHubsStep
            profile={profile}
            onNext={() => updateStep('setup-profile')}
            onBack={() => updateStep('welcome')}
          />
        );
      case 'setup-profile':
        return (
          <SetupProfileStep
            profile={profile}
            onNext={() => updateStep('complete')}
            onBack={() => updateStep('select-hubs')}
          />
        );
      case 'complete':
        return (
          <CompleteStep
            profile={profile}
            onComplete={completeOnboarding}
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
          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;