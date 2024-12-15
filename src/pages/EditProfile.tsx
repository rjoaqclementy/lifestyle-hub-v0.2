import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { updateProfile } from '../lib/profile';
import SearchableDropdown from "../components/auth/SearchableDropdown";
import ProfileImage from "../components/ProfileImage";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    bio: '',
    country: '',
    city: '',
    profile_picture_url: '',
    is_public: true
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch username from usernames table
      const { data: usernameData, error: usernameError } = await supabase
        .from('usernames')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (usernameError && usernameError.code !== 'PGRST116') throw usernameError;

      setFormData({
        username: usernameData?.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        country: profile.country || '',
        city: profile.city || '',
        profile_picture_url: profile.profile_picture_url || '',
        is_public: profile.is_public
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await updateProfile(formData);
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpdate = (url: string) => {
    setFormData(prev => ({ ...prev, profile_picture_url: url }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Edit Profile</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <ProfileImage
              url={formData.profile_picture_url}
              onUpload={handleProfileImageUpdate}
              size={120}
              editable={true}
            />
          </div>

          {/* Basic Info */}
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff] resize-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Location</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Country
                </label>
                <SearchableDropdown
                  value={formData.country}
                  onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                  placeholder="Select your country"
                  icon={<Globe className="w-5 h-5" />}
                  fetchOptions={async (search) => {
                    const { data } = await supabase
                      .from('countries')
                      .select('code as value, name as label')
                      .ilike('name', `%${search}%`)
                      .limit(10);
                    return data || [];
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  City
                </label>
                <SearchableDropdown
                  value={formData.city}
                  onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                  placeholder={formData.country ? "Select your city" : "Select a country first"}
                  disabled={!formData.country}
                  icon={<Globe className="w-5 h-5" />}
                  fetchOptions={async (search) => {
                    if (!formData.country) return [];
                    const { data } = await supabase
                      .from('cities')
                      .select('id as value, name as label')
                      .eq('country_code', formData.country)
                      .ilike('name', `%${search}%`)
                      .limit(10);
                    return data || [];
                  }}
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Privacy Settings</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Account Privacy</h3>
                <p className="text-sm text-gray-400">
                  {formData.is_public 
                    ? 'Anyone can view your profile' 
                    : 'Only your followers can view your profile'
                  }
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#573cff]"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfile;