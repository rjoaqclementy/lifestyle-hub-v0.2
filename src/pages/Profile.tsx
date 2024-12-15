import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Lock, Calendar, Settings, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import HubHighlights from '../components/Profile/HubHighlights';
import ProfileImage from '../components/ProfileImage';
import EditProfileModal from '../components/Profile/EditProfileModal';
import ProfileStats from '../components/Profile/ProfileStats';
import HubProfilesRow from '../components/Profile/HubProfilesRow';
import ProfileTabs from '../components/Profile/ProfileTabs';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import ProfileActions from '../components/Profile/ProfileActions';
import ProfileHeader from '../components/Profile/ProfileHeader';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hubs');
  const [hubProfiles, setHubProfiles] = useState([]);
  const [locationDetails, setLocationDetails] = useState<{
    country?: string;
    city?: string;
  }>({});
  const [profileUsername, setProfileUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await fetchWithRetry(() => supabase.auth.getUser());
        setCurrentUser(user);

        // Fetch profile data
        let profileQuery;
        if (username) {
          // First get the user ID from the username
          const { data: usernameData, error: usernameError } = await fetchWithRetry(() =>
            supabase
              .from('usernames')
              .select('user_id')
              .eq('username', username)
              .single()
          );

          if (usernameError) {
            if (usernameError.code === 'PGRST116') {
              setError('Profile not found');
            } else {
              throw usernameError;
            }
            return;
          }

          profileQuery = supabase
            .from('profiles')
            .select(`
              *,
              followers!followers_following_id_fkey(follower_id)
            `)
            .eq('id', usernameData.user_id)
            .single();
        } else if (user) {
          profileQuery = supabase
            .from('profiles')
            .select(`
              *,
              followers!followers_following_id_fkey(follower_id)
            `)
            .eq('id', user.id)
            .single();
        } else {
          throw new Error('No profile specified');
        }

        const { data: profileData, error: profileError } = await profileQuery;

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            setError('Profile not found');
          } else {
            throw profileError;
          }
          return;
        }

        // Fetch username
        const { data: usernameData } = await fetchWithRetry(async () => supabase
          .from('usernames')
          .select('username')
          .eq('user_id', profileData.id)
          .single());

        setProfileUsername(usernameData?.username || null);

        // Fetch location details
        if (profileData.country) {
          const { data: countryData } = await fetchWithRetry(() => supabase
            .from('countries')
            .select('name')
            .eq('code', profileData.country)
            .single());

          if (countryData) {
            setLocationDetails(prev => ({ ...prev, country: countryData.name }));
          }
        }

        if (profileData.city) {
          const { data: cityData } = await fetchWithRetry(() => supabase
            .from('cities')
            .select('name')
            .eq('id', profileData.city)
            .single());

          if (cityData) {
            setLocationDetails(prev => ({ ...prev, city: cityData.name }));
          }
        }

        // Fetch hub profiles separately
        const { data: hubProfilesData, error: hubProfilesError } = await fetchWithRetry(() => supabase
          .from('hub_profiles')
          .select(`
            *,
            hub:hubs(name, display_name)
          `)
          .eq('user_id', profileData.id));

        if (hubProfilesError) throw hubProfilesError;

        // Check if current user is following this profile
        if (user && profileData.id !== user.id) {
          const { data: followData } = await fetchWithRetry(() => supabase
            .from('followers')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', profileData.id)
            .single());

          setIsFollowing(!!followData);
        }

        setProfile(profileData);
        setHubProfiles(hubProfilesData || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
        // Reset error state if successful
        if (!error) setError(null);
      }
    };

    fetchProfile();
  }, [username, error]);

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile(prev => ({
        ...prev,
        ...updatedData
      }));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleFollowChange = (following: boolean) => {
    setIsFollowing(following);
    setProfile(prev => ({
      ...prev,
      followers_count: following ? prev.followers_count + 1 : prev.followers_count - 1
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-gray-400 mb-8">The profile you're looking for doesn't exist or is not accessible.</p>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profileUsername || 'Anonymous User';

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <ProfileHeader
        username={profileUsername}
        isPrivate={profile.is_private}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {/* Cover Image */}
      <div className="relative h-48 bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4">
          <div className="p-1 bg-gray-900 rounded-full">
            <ProfileImage
              url={profile?.profile_picture_url}
              onUpload={(url) => handleProfileUpdate({ profile_picture_url: url })}
              size={120}
              editable={isOwnProfile}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4">
          <ProfileActions
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            profileId={profile?.id}
            onFollowChange={handleFollowChange}
          />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Info */}
        <div className="mt-20 mb-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <p className="text-gray-500">@{profileUsername}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4">
            <button className="hover:underline">
              <span className="font-bold">{profile?.following_count || 0}</span>{' '}
              <span className="text-gray-500">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold">{profile?.followers_count || 0}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </button>
          </div>

          {profile?.bio && (
            <p className="mt-4 text-gray-200">{profile.bio}</p>
          )}

          <div className="flex items-center gap-6 mt-4 text-gray-400">
            {profile?.city && profile?.country && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.city}, {profile.country}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Hub Highlights */}
        <HubHighlights hubProfiles={hubProfiles} />

        {/* Content Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profile={profile}
          isOwnProfile={isOwnProfile}
        />
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          username={profileUsername}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;