// src/components/steps/PersonalInfoStep.tsx

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import DatePicker from '../DatePicker';

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
  };
  onChange: (field: string, value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  onChange,
  onValidityChange,
}) => {
  useEffect(() => {
    const isValid = !!(
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.birthday &&
      formData.gender
    );
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  return (
    <motion.div
      key="personal-info-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-gray-400">This helps us personalize your experience</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Birthday
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <DatePicker
            value={formData.birthday}
            onChange={(date) => onChange('birthday', date)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer Not To Say' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('gender', option.value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.gender === option.value
                  ? 'border-[#573cff] bg-[#573cff]/10'
                  : 'border-gray-700 hover:border-[#573cff]/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;
