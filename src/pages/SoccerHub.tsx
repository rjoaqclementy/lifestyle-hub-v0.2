import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trophy, Users, Play, ArrowRight, UserCircle2 } from 'lucide-react';
import JoinHubPrompt from '../components/soccer/JoinHubPrompt';
import { LobbyManager } from '../components/soccer/lobby/LobbyManager';

const SoccerHub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [hubId, setHubId] = useState(null);

  useEffect(() => {
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get soccer hub ID
      const { data: hubData, error: hubError } = await supabase
        .from('hubs')
        .select('id')
        .eq('name', 'soccer')
        .single();

      if (hubError) throw hubError;
      setHubId(hubData.id);

      // Fetch the user's hub profile (alias, player card)
      const { data: hubProfile, error: profileError } = await supabase
        .from('hub_profiles')
        .select(`
          id,
          bio,
          alias,
          profile_picture_url,
          sports_player_profiles (
            id,
            skill_level,
            years_experience,
            player_card_url,
            sport_specific_data
          )
        `)
        .eq('user_id', user.id)
        .eq('hub_id', hubData.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // hubProfile will contain alias and sports_player_profiles if they exist
      setProfile(hubProfile);

    } catch (error) {
      console.error('Error initializing profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1540379708242-14a809bef941?auto=format&fit=crop&q=80&w=2940)',
        }}
      />

      <div className="relative">
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="w-20" />
            <h1 className="text-xl font-semibold flex-1 text-center">Soccer Hub</h1>
            <div className="w-20 flex justify-end">
              <Link 
                to={profile ? "/soccer/profile" : "/soccer/join"}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <UserCircle2 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!profile ? (
            <JoinHubPrompt onComplete={() => {
              initializeProfile();
              navigate('/soccer/profile');
            }} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/soccer/play')}
                  className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-500 p-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <Play className="w-5 h-5" />
                    <span className="text-lg font-bold">PLAY NOW</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-500 p-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5" />
                    <span className="text-lg font-bold">TOURNAMENTS</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5" />
                    <span className="text-lg font-bold">TEAMS</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </>
          )}
        </div>

        {/* Lobby Section */}
        {profile && hubId && (
          <div className="mt-12 relative">
            <div className="max-w-4xl mx-auto">
              {/* Pass hubId and userProfile to LobbyManager */}
              <LobbyManager hubId={hubId} userProfile={profile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoccerHub;
