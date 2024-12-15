import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Trophy } from 'lucide-react';

interface ConfirmationStepProps {
  formData: any;
  venues: any[];
  onUpdate: (data: any) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, venues, onUpdate }) => {
  const [description, setDescription] = useState(formData.description || '');

  const selectedVenue = venues.find(v => v.id === formData.venueId);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onUpdate({ ...formData, description: newDescription });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Match Details
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>Type: <span className="capitalize">{formData.type}</span></p>
            <p>Format: {formData.playersPerTeam}v{formData.playersPerTeam}</p>
            <p>Gender: <span className="capitalize">{formData.genderPreference}</span></p>
            <p>Skill Level: <span className="capitalize">{formData.skillLevel}</span></p>
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>Date: {new Date(formData.date).toLocaleDateString()}</p>
            <p>Time: {formData.time}</p>
            <p>Duration: {formData.duration} minutes</p>
          </div>
        </motion.div>
      </div>

      {/* Venue */}
      {selectedVenue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Venue
          </h3>
          <div className="flex items-start space-x-4">
            {selectedVenue.image_url ? (
              <img
                src={selectedVenue.image_url}
                alt={selectedVenue.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-800 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div>
              <h4 className="font-semibold">{selectedVenue.name}</h4>
              <p className="text-gray-400">{selectedVenue.address}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Additional Information
        </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add any additional details about the match..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
      </motion.div>
    </div>
  );
};

export default ConfirmationStep;