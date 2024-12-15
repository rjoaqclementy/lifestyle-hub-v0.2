import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Trophy, Star, ArrowRight, UserCircle2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MatchList from '../../components/soccer/MatchList';
import useMatches from '../../hooks/useMatches';

const matchTypes = [
  {
    id: 'casual',
    name: 'Casual Match',
    description: 'Friendly matches with no pressure',
    icon: Users,
    color: 'from-emerald-600 to-green-500'
  },
  {
    id: 'ranked',
    name: 'Ranked Match',
    description: 'Competitive matches that affect your ranking',
    icon: Trophy,
    color: 'from-blue-600 to-indigo-500'
  },
  {
    id: 'tournament',
    name: 'Tournament',
    description: 'Organized competitions with prizes',
    icon: Star,
    color: 'from-purple-600 to-pink-500'
  }
];

const Play = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);
  const { matches, loading: matchesLoading } = useMatches();

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (matchData: any) => {
    try {
      // Navigate to the match page after creation
      navigate(`/soccer/match/${matchData.id}`);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link 
            to="/soccer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Hub
          </Link>
          <h1 className="text-xl font-semibold flex-1 text-center">Play</h1>
          <Link 
            to="/soccer/profile"
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <UserCircle2 className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Match Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            to="/soccer/create-match"
            className="w-full bg-gradient-to-r from-[#573cff] to-blue-500 hover:from-[#573cff]/90 hover:to-blue-500/90 
              text-white rounded-lg p-6 flex items-center justify-between group transition-all duration-300
              shadow-lg hover:shadow-[#573cff]/20"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">Create Match</h3>
                <p className="text-white/70">Set up your own match and invite players</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Available Matches */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Matches</h2>
          <MatchList matches={matches} loading={matchesLoading} />
        </section>
        {/* Quick Join Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Quick Join</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  className={`card relative overflow-hidden group cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative p-6">
                    <Icon className="w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                    <p className="text-gray-400 mb-4">{type.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {type.id === 'casual' ? '0 players online' : 'Coming soon'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
};

export default Play;