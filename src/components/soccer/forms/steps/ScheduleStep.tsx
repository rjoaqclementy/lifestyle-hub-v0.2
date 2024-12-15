import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleStepProps {
  formData: {
    date: string;
    time: string;
    duration: number;
  };
  onChange: (data: Partial<ScheduleStepProps['formData']>) => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ formData, onChange }) => {
  const handleChange = (field: string, value: string | number) => {
    onChange({ [field]: value });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold mb-4">Schedule</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              min={today}
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-12 text-white focus:outline-none focus:border-[#573cff]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-12 text-white focus:outline-none focus:border-[#573cff]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[60, 90, 120].map((duration) => (
              <button
                key={duration}
                onClick={() => handleChange('duration', duration)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.duration === duration
                    ? 'border-[#573cff] bg-[#573cff]/10'
                    : 'border-gray-700 hover:border-[#573cff]/50'
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleStep;