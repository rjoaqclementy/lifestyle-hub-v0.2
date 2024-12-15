import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CalendarRange, ChevronDown } from 'lucide-react';

interface MatchDetailsStepProps {
  formData: {
    type: string;
    players_per_team: number;
    gender_preference: string;
    skill_level: string;
    description: string;
    restrictions: {
      age: 'none' | 'under-18' | 'under-21' | 'over-18' | 'over-21' | 'custom';
      minAge?: number;
      maxAge?: number;
      teamBalancing: boolean;
    };
  };
  onChange: (data: Partial<MatchDetailsStepProps['formData']>) => void;
}

const MatchDetailsStep: React.FC<MatchDetailsStepProps> = ({ formData, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });

    // Update restrictions when gender or skill level changes
    if (field === 'gender_preference' || field === 'skill_level') {
      onChange({
        restrictions: {
          ...formData.restrictions,
          gender: value === 'mixed' ? 'mixed' : `${value}-only`,
          skillLevel: [value === 'all' ? 'all' : value]
        }
      });
    }
  };

  const handleRestrictionChange = (field: string, value: any) => {
    onChange({
      restrictions: {
        ...formData.restrictions,
        [field]: value
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold mb-4">Match Details</h3>

      <div className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-6">
          {/* Match Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Match Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
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
                type="button"
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

          {/* Players per Team */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Players per Team
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[5, 7, 11].map((num) => (
                <button
                  key={num}
                  type="button"
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

          {/* Gender Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender Preference
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['men', 'women', 'mixed'].map((gender) => (
                <button
                  key={gender}
                  type="button"
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

          {/* Skill Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill Level
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['beginner', 'intermediate', 'advanced', 'all'].map((level) => (
                <button
                  key={level}
                  type="button"
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
        </div>

        {/* Advanced Settings Collapsible */}
        <div className="border-t border-gray-800 pt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-gray-400 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Advanced Settings</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-6 pt-6">
                  {/* Age Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Age Requirements
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'none', label: 'No Restrictions', desc: 'All ages 13+' },
                        { value: 'under-18', label: 'Under 18', desc: 'Youth players only' },
                        { value: 'over-18', label: '18 and Over', desc: 'Adult players only' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleRestrictionChange('age', option.value)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            formData.restrictions.age === option.value
                              ? 'border-[#573cff] bg-[#573cff]/10'
                              : 'border-gray-700 hover:border-[#573cff]/50'
                          }`}
                        >
                          <CalendarRange className="w-5 h-5 mb-2" />
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-gray-400">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Team Balancing */}
                  <div className="flex items-center justify-between p-4 border-2 border-gray-700 rounded-lg">
                    <div>
                      <h5 className="font-semibold">Automatic Team Balancing</h5>
                      <p className="text-sm text-gray-400">Balance teams based on skill levels</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestrictionChange('teamBalancing', !formData.restrictions.teamBalancing)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.restrictions.teamBalancing ? 'bg-[#573cff]' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.restrictions.teamBalancing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Description */}
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