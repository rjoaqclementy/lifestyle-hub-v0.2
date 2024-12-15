import React from 'react';

interface ProfileBioProps {
  bio: string;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  if (!bio) return null;

  return (
    <p className="text-gray-300 mb-4">{bio}</p>
  );
};

export default ProfileBio;