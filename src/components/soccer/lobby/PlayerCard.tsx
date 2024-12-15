import React from 'react';

const PlayerCard = ({ profile, onUpdate, editable = false }) => {
  const femaleImage = 'https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/Leonardo_Phoenix_A_sleek_and_dynamic_female_soccer_player_avat_0.jpg';
  const maleImage = 'https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/Leonardo_Phoenix_A_male_soccer_players_3D_avatar_faceless_and_1.jpg';

  const getPlayerImage = () => {
    if (profile.profile_picture_url) {
      return profile.profile_picture_url;
    }
    if (profile.is_guest) {
      return profile.gender === 'female' ? femaleImage : maleImage;
    }
    return maleImage;
  };

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      <img
        src={getPlayerImage()}
        alt={profile.name || 'Player Card'}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default PlayerCard;