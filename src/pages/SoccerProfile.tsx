import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Calendar, Edit2, MapPin, Users } from 'lucide-react';
import EditSoccerProfile from '../components/soccer/EditSoccerProfile';
import { supabase } from '../lib/supabase';
import { HUBS } from '../lib/constants';
import PlayerCard from '../components/soccer/PlayerCard';

const SoccerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (!user) throw new Error('No user found');

      // Get user's main profile for the name
      const { data: mainProfile, error: mainProfileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (mainProfileError) throw mainProfileError;

      // Get hub profile
      const { data: hubProfile, error: hubError } = await supabase
        .from('hub_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('hub_id', HUBS.SOCCER)
        .single();

      if (hubError && hubError.code !== 'PGRST116') throw hubError;

      // If no hub profile exists, create one
      let finalHubProfile = hubProfile;
      if (!hubProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert({
            user_id: user.id,
            hub_id: HUBS.SOCCER,
            bio: '',
            stats: {}
          })
          .select()
          .single();

        if (createError) throw createError;
        finalHubProfile = newProfile;
      }

      if (finalHubProfile) {
        // Get sports profile
        const { data: sportsProfile, error: sportsError } = await supabase
          .from('sports_player_profiles')
          .select('*')
          .eq('hub_profile_id', finalHubProfile.id)
          .eq('sport_type', 'soccer')
          .single();

        if (sportsError && sportsError.code !== 'PGRST116') throw sportsError;

        // If no sports profile exists, create one
        if (!sportsProfile) {
          const { data: newSportsProfile, error: createSportsError } = await supabase
            .from('sports_player_profiles')
            .insert({
              hub_profile_id: finalHubProfile.id,
              sport_type: 'soccer',
              skill_level: null,
              years_experience: null,
              player_stats: {},
              sport_specific_data: {},
              preferences: {}
            })
            .select()
            .single();

          if (createSportsError) throw createSportsError;
          setProfile({ ...finalHubProfile, ...newSportsProfile, full_name: mainProfile.full_name });
        } else {
          setProfile({ ...finalHubProfile, ...sportsProfile, full_name: mainProfile.full_name });
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if ('bio' in updatedData || 'profile_picture_url' in updatedData) {
        // Update hub profile
        const { error: updateError } = await supabase
          .from('hub_profiles')
          .update({
            bio: updatedData.bio,
            profile_picture_url: updatedData.profile_picture_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;
      }

      if ('skill_level' in updatedData || 'years_experience' in updatedData || 'sport_specific_data' in updatedData) {
        // Update sports profile
        const { error: updateError } = await supabase
          .from('sports_player_profiles')
          .update({
            skill_level: updatedData.skill_level,
            years_experience: updatedData.years_experience,
            sport_specific_data: updatedData.sport_specific_data,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;
      }

      await fetchProfile(); // Refetch profile after update
      setIsEditing(false); // Close edit mode after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile?.user_id;
  const displayName = profile?.alias || (profile?.full_name ? `${profile.first_name} ${profile.last_name}` : 'Anonymous Player');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                navigate('/soccer');
              }
            }}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">
            {isEditing ? 'Edit Soccer Profile' : 'Soccer Profile'}
          </h1>
          {isOwnProfile && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <EditSoccerProfile 
            profile={profile} 
            onUpdate={handleProfileUpdate}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Player Card */}
            <div>
              <PlayerCard 
                profile={profile}
                onUpdate={(url) => handleProfileUpdate({ player_card_url: url })}
                editable={isOwnProfile}
              />
            </div>

            {/* Middle Column - Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center space-x-6">
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={displayName}
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-gray-700">
                      <span className="text-3xl text-gray-400">
                        {displayName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{displayName}</h2>
                    <p className="text-gray-400">
                      {profile?.skill_level || 'Skill Level Not Set'} • {profile?.years_experience?.replace('_', '-') || 'Experience Not Set'}
                    </p>
                    {profile?.bio && (
                      <p className="mt-2 text-gray-300">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Matches Won</p>
                      <p className="text-2xl font-bold">{profile?.stats?.matches_won || 0}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Goals Scored</p>
                      <p className="text-2xl font-bold">{profile?.stats?.goals_scored || 0}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-400">Matches Played</p>
                      <p className="text-2xl font-bold">{profile?.stats?.matches_played || 0}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Player Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-6">Player Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Preferred Positions</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile?.sport_specific_data?.positions?.map((position: string) => (
                        <span
                          key={position}
                          className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                        >
                          {position}
                        </span>
                      )) || (
                        <span className="text-gray-500">No positions set</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Preferred Foot</h4>
                    <p className="capitalize">
                      {profile?.sport_specific_data?.preferred_foot || 'Not specified'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                <p className="text-gray-400">No recent activity</p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoccerProfile;