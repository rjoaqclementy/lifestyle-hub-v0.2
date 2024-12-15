import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PlayerCard from '../PlayerCard';

interface PlayerDetailsFormProps {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
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

const PlayerDetailsForm: React.FC<PlayerDetailsFormProps> = ({ profile, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    skill_level: profile?.skill_level || '',
    years_experience: profile?.years_experience || '',
    sport_type: 'soccer',
    sport_specific_data: {
      positions: profile?.sport_specific_data?.positions || [],
      preferred_foot: profile?.sport_specific_data?.preferred_foot || ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const handlePlayerCardUpdate = async (url: string) => {
    await onUpdate({ player_card_url: url });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'preferred_foot') {
      setFormData(prev => ({
        ...prev,
        sport_specific_data: {
          ...prev.sport_specific_data,
          preferred_foot: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const togglePosition = (position: string) => {
    setFormData(prev => ({
      ...prev,
      sport_specific_data: {
        ...prev.sport_specific_data,
        positions: prev.sport_specific_data.positions.includes(position)
          ? prev.sport_specific_data.positions.filter(p => p !== position)
          : [...prev.sport_specific_data.positions, position]
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Player Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Skill Level</label>
                <select
                  name="skill_level"
                  value={formData.skill_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience</label>
                <select
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">More than 5 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Foot</label>
                <select
                  name="preferred_foot"
                  value={formData.sport_specific_data.preferred_foot}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">Select Foot</option>
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Positions</label>
                <div className="grid grid-cols-2 gap-2">
                  {positions.map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => togglePosition(position)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                        formData.sport_specific_data.positions.includes(position)
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50'
                      } border`}
                      disabled={loading}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 relative overflow-hidden group bg-emerald-500 hover:bg-emerald-600"
            >
              <span className="relative z-10">
                {loading ? 'Saving...' : 'Save Details'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Player Card</h2>
          
          <div className="flex justify-center">
            <div className="w-[300px] aspect-[9/16]">
              <PlayerCard
                profile={profile}
                onUpdate={handlePlayerCardUpdate}
                editable={true}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerDetailsForm;