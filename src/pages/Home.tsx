import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  TrendingUp, 
  Calendar, 
  Users, 
  Activity, 
  Heart, 
  Brain, 
  Coffee, 
  UserCircle2, 
  ChevronRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Feed from '../components/Feed';

interface Hub {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
}

const hubs: Hub[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Lifestyle Hub',
    icon: Activity,
    path: '/lifestyle'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Soccer Hub',
    icon: Coffee,
    path: '/soccer'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Basketball Hub',
    icon: Brain,
    path: '/basketball'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Tennis Hub',
    icon: Heart,
    path: '/tennis'
  }
];

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleHubClick = (hub: Hub) => {
    navigate(hub.path, { state: { hubId: hub.id } });
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="w-20" />
            <h1 className="text-xl font-semibold flex-1 text-center">Home</h1>
            <div className="flex items-center space-x-4 w-20 justify-end">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Compass className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
              </button>
              <Link 
                to="/profile"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <UserCircle2 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="py-12">
          <div className="max-w-[1800px] mx-auto flex">
            {/* Left Sidebar - Hubs */}
            <div className="w-56 flex-shrink-0 sticky top-24 self-start pl-4">
              <h2 className="text-xl font-bold mb-4">Explore Hubs</h2>
              <nav className="space-y-1">
                {hubs.map((hub) => {
                  const Icon = hub.icon;
                  return (
                    <motion.button
                      key={hub.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleHubClick(hub)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#573cff]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#573cff]" />
                      </div>
                      <span className="flex-1 text-left text-sm text-gray-300 group-hover:text-white">
                        {hub.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Main Feed Section */}
            <div className="flex-1 min-w-0 max-w-3xl mx-auto px-8">
              <Feed />
            </div>

            {/* Right Sidebar - Welcome Widgets */}
            <div className="w-56 flex-shrink-0 space-y-4 sticky top-24 self-start pr-4">
              <h2 className="text-xl font-bold mb-4">Welcome back!</h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card bg-gradient-to-br from-purple-500/10 to-blue-500/5 border-purple-500/20 hover:border-purple-500/40"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Today's Schedule</h3>
                <p className="text-xs text-gray-400">View your planned activities</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 hover:border-blue-500/40"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Activity Tracking</h3>
                <p className="text-xs text-gray-400">Monitor your progress</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20 hover:border-emerald-500/40"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Communities</h3>
                <p className="text-xs text-gray-400">Connect with others</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-6 lg:px-8 py-24 flex items-center"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Organize Your
              <span className="text-[#573cff]"> Lifestyle</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Join the ultimate platform for organizing and managing your lifestyle.
              Track activities, connect with communities, and achieve your goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/auth" className="btn-primary">
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Activity className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Activity Tracking</h3>
              <p className="text-gray-400">Monitor and organize your daily activities with ease.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Users className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-400">Connect with like-minded people and share experiences.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Calendar className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Planning</h3>
              <p className="text-gray-400">Plan and organize your activities efficiently.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;