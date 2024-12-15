import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PlayerCard from '../../../components/soccer/PlayerCard';
import { supabase } from '../../../lib/supabase';

interface PlayerCardStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

const PlayerCardStep: React.FC<PlayerCardStepProps> = ({
  formData,
  onChange,
  onValidityChange
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Player card is optional
    onValidityChange(true);
  }, [onValidityChange]);

  const handlePlayerCardUpdate = async (url: string) => {
    try {
      setError(null);

      // Just update the form data - actual profile update will happen during final submit
      onChange('player_card_url', url);
    } catch (err) {
      console.error('Error updating player card:', err);
      const message = err instanceof Error ? err.message : 'Failed to update player card';
      setError(message);
      throw err;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Player Card</h3>
        <p className="text-gray-400">Customize your player card appearance</p>
        {error && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <div className="w-[300px] aspect-[9/16]">
          <PlayerCard
            profile={formData}
            onUpdate={handlePlayerCardUpdate}
            editable={true}
          />
        </div>
      </div>

      <div className="text-center text-gray-400">
        <p>This is how other players will see you in matches and tournaments.</p>
        <p className="text-sm mt-2">You can always update your player card later.</p>
      </div>
    </motion.div>
  );
};

export default PlayerCardStep;