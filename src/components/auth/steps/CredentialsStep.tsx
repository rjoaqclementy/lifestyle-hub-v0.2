// src/components/steps/CredentialsStep.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Loader,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface CredentialsStepProps {
  formData: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (field: string, value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

const validateUsername = (username: string) => {
  // Username must be 3-20 characters, contain only lowercase letters, numbers, and underscores
  const regex = /^[a-z0-9_]{3,20}$/;
  return regex.test(username);
};

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

const CredentialsStep: React.FC<CredentialsStepProps> = ({
  formData,
  onChange,
  onValidityChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Function to check if the email is already registered
  const checkEmail = async (email: string) => {
    if (!validateEmail(email)) {
      setEmailAvailable(null);
      return;
    }

    try {
      setCheckingEmail(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      setEmailAvailable(data ? false : true);
    } catch (err) {
      console.error('Error checking email:', err);
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Function to check if the username is available
  const checkUsername = async (username: string) => {
    if (!validateUsername(username)) {
      setUsernameAvailable(null);
      return;
    }

    try {
      setCheckingUsername(true);
      const { data, error } = await supabase
        .from('usernames')
        .select('user_id')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;
      setUsernameAvailable(data ? false : true);
    } catch (err) {
      console.error('Error checking username:', err);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Validate input fields and update errors
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (formData.email) {
      if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email address';
      } else if (emailAvailable === false && !checkingEmail) {
        newErrors.email = 'Email is already registered';
      } else if (checkingEmail) {
        newErrors.email = 'Checking email availability...';
      }
    }

    if (formData.username) {
      if (!validateUsername(formData.username)) {
        newErrors.username =
          'Username must be 3-20 characters, and contain only lowercase letters, numbers, and underscores';
      } else if (usernameAvailable === false && !checkingUsername) {
        newErrors.username = 'Username is not available';
      } else if (checkingUsername) {
        newErrors.username = 'Checking username availability...';
      }
    }

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    const isValid =
      Object.keys(newErrors).length === 0 &&
      formData.email &&
      emailAvailable === true &&
      formData.username &&
      usernameAvailable === true &&
      formData.password &&
      formData.confirmPassword &&
      !checkingEmail &&
      !checkingUsername;

    onValidityChange(isValid);
  }, [
    formData,
    emailAvailable,
    usernameAvailable,
    checkingEmail,
    checkingUsername,
    onValidityChange,
  ]);

  // Check email availability when the email input changes
  useEffect(() => {
    if (formData.email) {
      const timeoutId = setTimeout(() => {
        checkEmail(formData.email);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setEmailAvailable(null);
    }
  }, [formData.email]);

  // Check username availability when the username input changes
  useEffect(() => {
    if (formData.username) {
      const timeoutId = setTimeout(() => {
        checkUsername(formData.username);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setUsernameAvailable(null);
    }
  }, [formData.username]);

  const getInputStatus = (field: string) => {
    if (!formData[field]) return '';
    return errors[field] ? 'border-red-400' : 'border-green-500';
  };

  return (
    <motion.div
      key="credentials-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Email Input */}
      <div className="flex flex-col">
        <div className="relative flex items-center h-12">
          <Mail className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Email"
            className={`w-full pl-10 pr-10 h-full border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#573cff] ${getInputStatus(
              'email'
            )}`}
          />
          {formData.email && (
            <div className="absolute right-3">
              {checkingEmail ? (
                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              ) : emailAvailable === true ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : emailAvailable === false ? (
                <X className="w-5 h-5 text-red-500" />
              ) : null}
            </div>
          )}
        </div>
        {errors.email && (
          <div className="text-red-400 text-sm mt-1">{errors.email}</div>
        )}
      </div>

      {/* Username Input */}
      <div className="flex flex-col">
        <div className="relative flex items-center h-12">
          <User className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange('username', e.target.value.toLowerCase())}
            placeholder="Username"
            className={`w-full pl-10 pr-10 h-full border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#573cff] ${getInputStatus(
              'username'
            )}`}
          />
          {formData.username && (
            <div className="absolute right-3">
              {checkingUsername ? (
                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              ) : usernameAvailable === true ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : usernameAvailable === false ? (
                <X className="w-5 h-5 text-red-500" />
              ) : null}
            </div>
          )}
        </div>
        {errors.username && (
          <div className="text-red-400 text-sm mt-1">{errors.username}</div>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col">
        <div className="relative flex items-center h-12">
          <Lock className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="Password"
            className={`w-full pl-10 pr-10 h-full border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#573cff] ${getInputStatus(
              'password'
            )}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <div className="text-red-400 text-sm mt-1">{errors.password}</div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="flex flex-col">
        <div className="relative flex items-center h-12">
          <Lock className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            placeholder="Confirm Password"
            className={`w-full pl-10 pr-10 h-full border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#573cff] ${getInputStatus(
              'confirmPassword'
            )}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 text-gray-400 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="text-red-400 text-sm mt-1">
            {errors.confirmPassword}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CredentialsStep;
