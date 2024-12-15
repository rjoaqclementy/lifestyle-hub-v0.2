import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ExperienceStepProps {
  formData: {
    skill_level: string;
    years_experience: string;
  };
  onChange: (field: string, value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  formData,
  onChange,
  onValidityChange
}) => {
  useEffect(() => {
    const isValid = formData.skill_level !== '' && formData.years_experience !== '';
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Experience Level</h3>
        <p className="text-gray-400">Tell us about your soccer experience</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Skill Level
        </label>
        <div className="grid grid-cols-2 gap-4">
          {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange('skill_level', level)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.skill_level === level
                  ? 'border-[#573cff] bg-[#573cff]/10'
                  : 'border-gray-700 hover:border-[#573cff]/50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Years of Experience
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '0-1', label: 'Less than 1 year' },
            { value: '1-3', label: '1-3 years' },
            { value: '3-5', label: '3-5 years' },
            { value: '5+', label: 'More than 5 years' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('years_experience', option.value)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.years_experience === option.value
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

export default ExperienceStep;