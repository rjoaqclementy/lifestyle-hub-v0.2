// src/components/steps/InterestsStep.tsx

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface InterestsStepProps {
  formData: {
    interests: string[];
  };
  onChange: (field: string, value: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

const interestsList = [
  'Soccer',
  'Basketball',
  'Tennis',
  'Volleyball',
  'Running',
  'Cycling',
  'Swimming',
  'Yoga',
  'Fitness',
  'Hiking',
  'Climbing',
  'Dancing',
  'Martial Arts',
  'Gaming',
  'Reading',
  'Music',
  'Movies',
  'Travel',
  'Photography',
  'Cooking',
];

const InterestsStep: React.FC<InterestsStepProps> = ({
  formData,
  onChange,
  onValidityChange,
}) => {
  useEffect(() => {
    // At least one interest must be selected
    onValidityChange(formData.interests?.length > 0);
  }, [formData.interests, onValidityChange]);

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];

    onChange('interests', updatedInterests);
  };

  return (
    <motion.div
      key="interests-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">What are your interests?</h3>
        <p className="text-gray-400 mb-6">
          Select all that apply. This helps us personalize your experience.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interestsList.map((interest) => (
            <motion.button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                ${formData.interests.includes(interest)
                  ? 'border-[#573cff] bg-[#573cff]/10 text-[#573cff]'
                  : 'border-gray-700 hover:border-[#573cff]/50 text-gray-300 hover:text-white'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Tag className="w-4 h-4" />
              <span>{interest}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Interest Count Indicator */}
      <div className="text-center text-gray-400">
        <p>
          {formData.interests.length} interests selected
          {formData.interests.length > 0 && ' • '}
          {formData.interests.length > 0 && (
            <button
              type="button"
              onClick={() => onChange('interests', [])}
              className="text-[#573cff] hover:underline"
            >
              Clear all
            </button>
          )}
        </p>
      </div>
    </motion.div>
  );
};

export default InterestsStep;
