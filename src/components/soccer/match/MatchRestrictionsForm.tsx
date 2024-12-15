import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, Scale } from 'lucide-react';
import type { MatchRestrictions, GenderRestriction, AgeRestriction } from '../../../types/match';

interface MatchRestrictionsFormProps {
  initialRestrictions?: Partial<MatchRestrictions>;
  onChange: (restrictions: MatchRestrictions) => void;
}

const MatchRestrictionsForm: React.FC<MatchRestrictionsFormProps> = ({
  initialRestrictions,
  onChange
}) => {
  const [restrictions, setRestrictions] = useState<MatchRestrictions>({
    gender: 'mixed',
    age: 'none',
    skillLevel: ['all'],
    maxPlayers: 14,
    teamBalancing: true,
    ...initialRestrictions
  });

  const handleChange = (field: keyof MatchRestrictions, value: any) => {
    const updatedRestrictions = { ...restrictions, [field]: value };
    setRestrictions(updatedRestrictions);
    onChange(updatedRestrictions);
  };

  return (
    <div className="space-y-6">
      {/* Gender Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Gender Restrictions
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChange('gender', 'mixed')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.gender === 'mixed'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Users className="w-5 h-5 mb-2" />
            <span>Mixed</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('gender', 'gender-ratio')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.gender === 'gender-ratio'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Scale className="w-5 h-5 mb-2" />
            <span>Gender Ratio</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('gender', 'men-only')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.gender === 'men-only'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Users className="w-5 h-5 mb-2" />
            <span>Men Only</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('gender', 'women-only')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.gender === 'women-only'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Users className="w-5 h-5 mb-2" />
            <span>Women Only</span>
          </button>
        </div>

        {restrictions.gender === 'gender-ratio' && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-3">Gender Ratio</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Men</label>
                <input
                  type="number"
                  min="0"
                  max={restrictions.maxPlayers}
                  value={restrictions.genderRatio?.men || 0}
                  onChange={(e) => handleChange('genderRatio', {
                    ...restrictions.genderRatio,
                    men: parseInt(e.target.value)
                  })}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Women</label>
                <input
                  type="number"
                  min="0"
                  max={restrictions.maxPlayers}
                  value={restrictions.genderRatio?.women || 0}
                  onChange={(e) => handleChange('genderRatio', {
                    ...restrictions.genderRatio,
                    women: parseInt(e.target.value)
                  })}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Age Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Age Restrictions
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChange('age', 'none')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.age === 'none'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Calendar className="w-5 h-5 mb-2" />
            <span>No Restrictions</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('age', 'under-18')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.age === 'under-18'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Calendar className="w-5 h-5 mb-2" />
            <span>Under 18</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('age', 'over-18')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.age === 'over-18'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Calendar className="w-5 h-5 mb-2" />
            <span>Over 18</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('age', 'custom')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              restrictions.age === 'custom'
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
          >
            <Calendar className="w-5 h-5 mb-2" />
            <span>Custom Range</span>
          </button>
        </div>

        {restrictions.age === 'custom' && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-3">Age Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Minimum Age</label>
                <input
                  type="number"
                  min="0"
                  value={restrictions.customAgeRange?.min || ''}
                  onChange={(e) => handleChange('customAgeRange', {
                    ...restrictions.customAgeRange,
                    min: parseInt(e.target.value)
                  })}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Maximum Age</label>
                <input
                  type="number"
                  min="0"
                  value={restrictions.customAgeRange?.max || ''}
                  onChange={(e) => handleChange('customAgeRange', {
                    ...restrictions.customAgeRange,
                    max: parseInt(e.target.value)
                  })}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Balancing */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={restrictions.teamBalancing}
            onChange={(e) => handleChange('teamBalancing', e.target.checked)}
            className="form-checkbox h-5 w-5 text-[#573cff] rounded border-gray-700 bg-gray-800"
          />
          <span>Enable automatic team balancing based on skill levels</span>
        </label>
      </div>
    </div>
  );
};

export default MatchRestrictionsForm;