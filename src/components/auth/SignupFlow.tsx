import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CredentialsStep from './steps/CredentialsStep';

interface SignupFlowProps {
  onComplete?: () => void;
}

const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValidityChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        console.error('Error signing up:', authError.message);
        setSignUpError(authError.message);
        return;
      }

      if (!authData.user) {
        setSignUpError('An error occurred during sign-up. Please try again.');
        return;
      }

      // Insert username
      const { error: usernameError } = await supabase
        .from('usernames')
        .insert({
          user_id: authData.user.id,
          username: formData.username,
        });

      if (usernameError) {
        console.error('Error inserting username:', usernameError.message);
        setSignUpError('Username is already taken. Please choose a different one.');

        // Clean up: sign out and delete the user
        await supabase.auth.signOut();
        return;
      }

      // Update initial profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          email: formData.email,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error creating profile:', profileError.message);
        setSignUpError('An error occurred while creating your profile.');
        return;
      }

      // Navigate to setup page
      if (onComplete) onComplete();
      navigate('/setup');
    } catch (error: any) {
      console.error('Error completing signup:', error);
      setSignUpError('An error occurred during sign-up. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {signUpError && (
        <div className="text-red-500 text-center mb-4">{signUpError}</div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CredentialsStep
          formData={formData}
          onChange={handleChange}
          onValidityChange={handleValidityChange}
        />
      </motion.div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isValid
              ? 'bg-[#573cff] hover:bg-[#573cff]/80 text-white'
              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignupFlow;