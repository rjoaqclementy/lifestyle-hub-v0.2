import React from 'react';
import { Lock, Settings } from 'lucide-react';

interface ProfileHeaderProps {
  username: string | null;
  isPrivate: boolean;
  isOwnProfile: boolean;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  isPrivate,
  isOwnProfile,
  onEditClick
}) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {username}
            {isPrivate && <Lock className="inline-block w-4 h-4 ml-2" />}
          </h1>
          {isOwnProfile && (
            <button
              onClick={onEditClick}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;