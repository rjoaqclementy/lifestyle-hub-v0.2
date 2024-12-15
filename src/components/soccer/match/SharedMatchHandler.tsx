import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const SharedMatchHandler: React.FC = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMatchAndRedirect();
  }, [matchId, navigate]);

  const checkMatchAndRedirect = async () => {
    try {
      // Just check if the match exists
      const { data: match, error } = await supabase
        .from('matches')
        .select('id, status')
        .eq('id', matchId)
        .single();

      if (error || !match) {
        console.error('Match not found');
        navigate('/soccer/play');
        return;
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Store match ID for redirect after auth
        localStorage.setItem('pendingMatchRedirect', matchId);
        navigate('/auth');
        return;
      }

      // If match exists, redirect to the match page
      navigate(`/soccer/match/${matchId}`);
    } catch (error) {
      console.error('Error handling shared match:', error);
      navigate('/soccer/play');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-16 h-16 text-[#573cff]" />
          <h1 className="text-2xl font-bold">Loading Match</h1>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-gray-400">Redirecting to match...</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedMatchHandler;