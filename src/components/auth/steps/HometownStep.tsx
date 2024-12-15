// src/components/steps/HometownStep.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import SearchableDropdown from '../SearchableDropdown';
import { supabase } from '../../../lib/supabase';

interface HometownStepProps {
  formData: {
    hometown: string; // The ID of the selected city
    current_city: string; // The ID of the selected city
  };
  onChange: (field: string, value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

interface Option {
  id: string;
  label: string;
}

const HometownStep: React.FC<HometownStepProps> = ({
  formData,
  onChange,
  onValidityChange,
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isValid = !!(formData.hometown && formData.current_city);
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  // Fetch city options based on search term
  const fetchCityOptions = async (searchTerm: string): Promise<Option[]> => {
    try {
      if (!searchTerm) return [];

      // Split the search term to separate city and country if provided
      const [citySearch, countrySearch] = searchTerm
        .split(',')
        .map((s) => s.trim());

      let query = supabase
        .from('cities')
        .select(`
          id,
          name,
          country: countries!inner(name)
        `)
        .ilike('name', `%${citySearch}%`)
        .limit(50);

      if (countrySearch) {
        query = query.ilike('country.name', `%${countrySearch}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data into options
      const options = data.map((city: any) => ({
        id: city.id,
        label: `${city.name}, ${city.country.name}`,
      }));

      return options;
    } catch (err) {
      console.error('Error fetching cities:', err);
      throw err;
    }
  };

  return (
    <motion.div
      key="hometown-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-semibold">Tell us about your locations</h2>
        <p className="text-gray-400">
          This helps us connect you with people from your area
        </p>
      </div>

      <div className="space-y-6">
        {/* Hometown Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Where were you born?
          </label>
          <SearchableDropdown
            value={formData.hometown}
            onChange={(value) => {
              onChange('hometown', value);
              setError(null);
            }}
            placeholder="Search and select your hometown"
            icon={<MapPin className="w-5 h-5" />}
            fetchOptions={fetchCityOptions}
          />
        </div>

        {/* Current City Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Where do you live now?
          </label>
          <SearchableDropdown
            value={formData.current_city}
            onChange={(value) => {
              onChange('current_city', value);
              setError(null);
            }}
            placeholder="Search and select your current city"
            icon={<MapPin className="w-5 h-5" />}
            fetchOptions={fetchCityOptions}
          />
          {formData.hometown === formData.current_city && (
            <p className="text-sm text-gray-400 mt-2">Same as hometown</p>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </motion.div>
  );
};

export default HometownStep;

