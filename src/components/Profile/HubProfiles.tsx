import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CircleDot, Dumbbell, Trophy, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HubProfile {
  id: string;
  name: string;
  display_name: string;
  icon: any;
  color: string;
  profile?: {
    id: string;
    profile_picture_url?: string;
    bio?: string;
  };
}

interface Props {
  userId: string;
}

const HubProfiles = ({ userId }: Props) => {
  const [hubProfiles, setHubProfiles] = React.useState<HubProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchHubProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all hubs
        const { data: hubs, error: hubsError } = await supabase
          .from('hubs')
          .select('*');

        if (hubsError) throw hubsError;

        // Fetch user's hub profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('hub_profiles')
          .select(`
            id,
            profile_picture_url,
            bio,
            hub_id
          `)
          .eq('user_id', userId);

        if (profilesError) throw profilesError;

        if (isMounted && hubs) {
          const mappedProfiles = hubs.map(hub => {
            const profile = profiles?.find(p => p.hub_id === hub.id);
            const hubConfig = getHubConfig(hub.name);

            return {
              id: hub.id,
              name: hub.name,
              display_name: hub.display_name,
              icon: hubConfig.icon,
              color: hubConfig.color,
              profile: profile ? {
                id: profile.id,
                profile_picture_url: profile.profile_picture_url,
                bio: profile.bio
              } : undefined
            };
          });

          setHubProfiles(mappedProfiles);
        }
      } catch (err) {
        console.error('Error fetching hub profiles:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch hub profiles');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHubProfiles();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const getHubConfig = (hubName: string) => {
    const configs: Record<string, { icon: any; color: string }> = {
      soccer: {
        icon: CircleDot,
        color: 'from-green-500 to-emerald-700'
      },
      fitness: {
        icon: Dumbbell,
        color: 'from-blue-500 to-indigo-700'
      },
      basketball: {
        icon: Activity,
        color: 'from-orange-500 to-red-700'
      },
      tennis: {
        icon: Trophy,
        color: 'from-yellow-500 to-amber-700'
      }
    };

    return configs[hubName] || configs.soccer;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-400 flex items-center justify-center p-4">
          <p>Failed to load hub profiles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <h3 className="text-xl font-semibold mb-6">Hub Profiles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubProfiles.map((hub) => {
          const Icon = hub.icon;
          return (
            <motion.div
              key={hub.id}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-lg border border-gray-700 hover:border-[#573cff] transition-all duration-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${hub.color} opacity-5`} />
              
              <div className="relative p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="w-6 h-6" />
                  <h4 className="font-semibold">{hub.display_name}</h4>
                </div>

                {hub.profile ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      {hub.profile.profile_picture_url ? (
                        <img
                          src={hub.profile.profile_picture_url}
                          alt={`${hub.display_name} Profile`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {hub.profile.bio || 'No bio yet'}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/${hub.name}/profile`}
                      className="btn-primary text-sm inline-flex items-center"
                    >
                      View Profile
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Create your profile in {hub.display_name} to unlock dedicated features and connect with others!
                    </p>
                    <Link
                      to={`/${hub.name}`}
                      className="btn-primary text-sm inline-flex items-center"
                    >
                      Explore Hub
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HubProfiles;