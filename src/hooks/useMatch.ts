import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const useMatch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInWaitingList, setIsInWaitingList] = useState(false);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const fetchMatch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get match details
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select(`
          id,
          type,
          date,
          time,
          duration,
          players_per_team,
          gender_preference,
          skill_level,
          description,
          status,
          restrictions,
          players_list_public,
          likes_count,
          hub_id,
          creator:hub_profiles!matches_creator_hub_profile_fkey(
            id,
            alias,
            bio,
            profile_picture_url,
            user_id
          ),
          venue:venues(*),
          match_players(
            *,
            player:hub_profiles(
              id,
              alias,
              profile_picture_url,
              user_id
            )
          ),
          waiting_list:match_waiting_list(
            id,
            player_id,
            position,
            player:hub_profiles(
              id,
              alias,
              profile_picture_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (matchError) throw matchError;
      if (!match) throw new Error('Match not found');

      // Initialize variables
      let hubProfile = null;
      let isWaitingList = false;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user's hub profile
        const { data: profile } = await supabase
          .from('hub_profiles')
          .select('id')
          .eq('user_id', user.id)
          .eq('hub_id', match.hub_id)
          .single();
          
        hubProfile = profile;

        // Check if user is in waiting list
        const { data: waitingList } = await supabase
          .from('match_waiting_list')
          .select('id')
          .eq('match_id', match.id)
          .eq('player_id', hubProfile.id)
          .single();

        isWaitingList = Boolean(waitingList);
      }

      // Fetch user profiles for creator and players
      const userIds = [
        match.creator?.user_id,
        ...(match.match_players?.map(p => p.player?.user_id) || [])
      ].filter(Boolean);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const userMap = profiles?.reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile
      }), {}) || {};

      // Format the response with proper names
      const formattedMatch = {
        ...match,
        creator: {
          ...match.creator,
          name: match.creator?.alias || 
            (userMap[match.creator?.user_id] 
              ? `${userMap[match.creator.user_id].first_name} ${userMap[match.creator.user_id].last_name}`
              : 'Anonymous Player')
        },
        match_players: match.match_players?.map(player => ({
          ...player,
          player: {
            ...player.player,
            name: player.player?.alias ||
              (userMap[player.player?.user_id]
                ? `${userMap[player.player.user_id].first_name} ${userMap[player.player.user_id].last_name}`
                : 'Anonymous Player')
          }
        }))
      };

      setMatch(formattedMatch);
      setProfile(hubProfile);
      setIsInWaitingList(isWaitingList);
    } catch (err) {
      console.error('Error fetching match details:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
    checkAuth();
  }, [id]);

  return { 
    match,
    loading,
    error,
    isAuthenticated,
    isOrganizer: profile?.id === match?.creator_id,
    currentUserHubProfile: profile,
    isInWaitingList
  };
};

export default useMatch;