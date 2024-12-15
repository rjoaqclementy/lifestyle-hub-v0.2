import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MatchRestrictionsForm from '../../match/MatchRestrictionsForm';
import type { MatchRestrictions } from '../../../../types/match';

interface MatchDetailsStepProps {
  formData: {
    type: string;
    players_per_team: number;
    gender_preference: string;
    skill_level: string;
    restrictions?: MatchRestrictions;
    description: string;
  };
  onChange: (data: Partial<MatchDetailsStepProps['formData']>) => void;
}

const MatchDetailsStep: React.FC<MatchDetailsStepProps> = ({ formData, onChange }) => {
  const handleChange = (field: string, value: string | number) => {
    onChange({ [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold mb-4">Match Details</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Match Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleChange('type', 'casual')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.type === 'casual'
                  ? 'border-[#573cff] bg-[#573cff]/10'
                  : 'border-gray-700 hover:border-[#573cff]/50'
              }`}
            >
              Casual
            </button>
            <button
              onClick={() => handleChange('type', 'competitive')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.type === 'competitive'
                  ? 'border-[#573cff] bg-[#573cff]/10'
                  : 'border-gray-700 hover:border-[#573cff]/50'
              }`}
            >
              Competitive
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Players per Team
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[5, 7, 11].map((num) => (
              <button
                key={num}
                onClick={() => handleChange('players_per_team', num)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.players_per_team === num
                    ? 'border-[#573cff] bg-[#573cff]/10'
                    : 'border-gray-700 hover:border-[#573cff]/50'
                }`}
              >
                {num}v{num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender Preference
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['men', 'women', 'mixed'].map((gender) => (
              <button
                key={gender}
                onClick={() => handleChange('gender_preference', gender)}
                className={`p-4 rounded-lg border-2 transition-colors capitalize ${
                  formData.gender_preference === gender
                    ? 'border-[#573cff] bg-[#573cff]/10'
                    : 'border-gray-700 hover:border-[#573cff]/50'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skill Level
          </label>
          <div className="grid grid-cols-2 gap-4">
            {['beginner', 'intermediate', 'advanced', 'all'].map((level) => (
              <button
                key={level}
                onClick={() => handleChange('skill_level', level)}
                className={`p-4 rounded-lg border-2 transition-colors capitalize ${
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

        {/* Match Restrictions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Match Restrictions</h3>
          <MatchRestrictionsForm
            initialRestrictions={formData.restrictions}
            onChange={(restrictions) => onChange({ restrictions })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-[#573cff]"
            placeholder="Add any additional details about the match..."
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MatchDetailsStep;