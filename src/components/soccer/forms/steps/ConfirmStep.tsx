import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';

interface ConfirmStepProps {
  formData: any;
  onSubmit: () => void;
  onBack: () => void;
}

const ConfirmStep: React.FC<ConfirmStepProps> = ({ formData, onSubmit, onBack }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-[#573cff]" />
              Match Details
            </h3>
            <div className="space-y-3 text-gray-300">
              <p>Type: <span className="capitalize">{formData.type}</span></p>
              <p>Format: {formData.players_per_team}v{formData.players_per_team}</p>
              <p>Gender: <span className="capitalize">{formData.gender_preference}</span></p>
              <p>Skill Level: <span className="capitalize">{formData.skill_level}</span></p>
            </div>
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#573cff]" />
              Schedule
            </h3>
            <div className="space-y-3 text-gray-300">
              <p>Date: {new Date(formData.date).toLocaleDateString()}</p>
              <p>Time: {formData.time}</p>
              <p>Duration: {formData.duration} minutes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-[#573cff]" />
          Additional Information
        </h3>
        <textarea
          value={formData.description}
          onChange={(e) => {}}
          placeholder="Add any additional details about the match..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff] resize-none"
        />
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="btn-primary px-8 py-2"
        >
          Create Match
        </button>
      </div>
    </div>
  );
};

export default ConfirmStep;