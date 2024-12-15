import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Beer, Droplets } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

interface Venue {
  id: string;
  name: string;
  address: string;
  image_url: string;
  has_parking: boolean;
  has_bar: boolean;
  has_showers: boolean;
}

interface VenueStepProps {
  formData: {
    venue_id: string;
  };
  onChange: (data: Partial<VenueStepProps['formData']>) => void;
}

const VenueStep: React.FC<VenueStepProps> = ({ formData, onChange }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .order('name');

        if (error) throw error;
        setVenues(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#573cff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading venues: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold mb-4">Select Venue</h3>

      <div className="grid grid-cols-1 gap-4">
        {venues.map((venue) => (
          <motion.div
            key={venue.id}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-lg border-2 transition-colors cursor-pointer ${
              formData.venue_id === venue.id
                ? 'border-[#573cff] bg-[#573cff]/10'
                : 'border-gray-700 hover:border-[#573cff]/50'
            }`}
            onClick={() => onChange({ venue_id: venue.id })}
          >
            <div className="flex">
              {venue.image_url && (
                <div className="w-1/3">
                  <img
                    src={venue.image_url}
                    alt={venue.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-4">
                <h4 className="text-lg font-semibold">{venue.name}</h4>
                <div className="flex items-center text-gray-400 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{venue.address}</span>
                </div>
                <div className="flex gap-4 mt-3">
                  {venue.has_parking && (
                    <div className="flex items-center text-gray-400">
                      <Car className="w-4 h-4 mr-1" />
                      <span className="text-sm">Parking</span>
                    </div>
                  )}
                  {venue.has_bar && (
                    <div className="flex items-center text-gray-400">
                      <Beer className="w-4 h-4 mr-1" />
                      <span className="text-sm">Bar</span>
                    </div>
                  )}
                  {venue.has_showers && (
                    <div className="flex items-center text-gray-400">
                      <Droplets className="w-4 h-4 mr-1" />
                      <span className="text-sm">Showers</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default VenueStep;