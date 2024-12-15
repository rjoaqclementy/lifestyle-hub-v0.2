import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreferencesStepProps {
  formData: {
    sport_specific_data: {
      positions: string[];
      preferred_foot: string;
    };
  };
  onChange: (field: string, value: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

const positions = [
  'Goalkeeper',
  'Center Back',
  'Full Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Attacking Midfielder',
  'Winger',
  'Forward',
  'Striker'
];

const PreferencesStep: React.FC<PreferencesStepProps> = ({
  formData,
  onChange,
  onValidityChange
}) => {
  useEffect(() => {
    const isValid = formData.sport_specific_data.positions.length > 0 &&
                   formData.sport_specific_data.preferred_foot !== '';
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  const togglePosition = (position: string) => {
    const positions = formData.sport_specific_data.positions;
    const newPositions = positions.includes(position)
      ? positions.filter(p => p !== position)
      : [...positions, position];
    
    onChange('sport_specific_data.positions', newPositions);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Playing Preferences</h3>
        <p className="text-gray-400">Tell us about your playing style</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preferred Foot
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['left', 'right', 'both'].map((foot) => (
            <button
              key={foot}
              type="button"
              onClick={() => onChange('sport_specific_data.preferred_foot', foot)}
              className={`p-4 rounded-lg border-2 transition-colors capitalize ${
                formData.sport_specific_data.preferred_foot === foot
                  ? 'border-[#573cff] bg-[#573cff]/10'
                  : 'border-gray-700 hover:border-[#573cff]/50'
              }`}
            >
              {foot}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preferred Positions
        </label>
        <div className="grid grid-cols-2 gap-2">
          {positions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => togglePosition(position)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.sport_specific_data.positions.includes(position)
                  ? 'border-[#573cff] bg-[#573cff]/10'
                  : 'border-gray-700 hover:border-[#573cff]/50'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PreferencesStep;