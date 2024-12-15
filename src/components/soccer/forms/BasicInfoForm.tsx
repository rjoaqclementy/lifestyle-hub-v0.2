import React from 'react';
import { supabase } from '../../../lib/supabase';
import ProfileImage from '../../ProfileImage';

const BasicInfoForm = ({ profile, onSave, onCancel }) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    bio: profile.bio || '',
    profile_picture_url: profile.profile_picture_url || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Update hub profile
      const { error: updateError } = await supabase
        .from('hub_profiles')
        .update({
          bio: formData.bio,
          profile_picture_url: formData.profile_picture_url,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', profile.user_id)
        .eq('hub_id', profile.hub_id);

      if (updateError) throw updateError;

      onSave(formData);
    } catch (error) {
      console.error('Error updating basic info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center mb-8">
        <ProfileImage
          url={formData.profile_picture_url}
          onUpload={(url) => setFormData(prev => ({ ...prev, profile_picture_url: url }))}
          size={120}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          placeholder="Tell us about yourself as a player..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default BasicInfoForm;