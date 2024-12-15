import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Car, Beer, Droplets } from 'lucide-react';

interface MatchScheduleProps {
  match: any;
  venue: any;
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ match, venue }) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card p-6"
    >
      <h3 className="font-semibold mb-6">Schedule & Location</h3>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#573cff]/10 rounded-lg">
            <Calendar className="w-5 h-5 text-[#573cff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Date</p>
            <p className="font-semibold">
              {new Date(match.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#573cff]/10 rounded-lg">
            <Clock className="w-5 h-5 text-[#573cff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Time</p>
            <p className="font-semibold">
              {formatTime(match.time)} ({match.duration} minutes)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#573cff]/10 rounded-lg">
            <MapPin className="w-5 h-5 text-[#573cff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Venue</p>
            <p className="font-semibold">{venue?.name}</p>
            <p className="text-gray-400 text-sm">{venue?.address}</p>
          </div>
        </div>

        {venue && (
          <div className="flex gap-4 mt-4">
            {venue.has_parking && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Car className="w-4 h-4" />
                <span>Parking</span>
              </div>
            )}
            {venue.has_bar && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Beer className="w-4 h-4" />
                <span>Bar</span>
              </div>
            )}
            {venue.has_showers && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Droplets className="w-4 h-4" />
                <span>Showers</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MatchSchedule;