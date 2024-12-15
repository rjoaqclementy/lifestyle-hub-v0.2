import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HUBS } from '../lib/constants';

export const useMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: matchesData, error: matchError } = await supabase
          .from('matches')
          .select(`
            *,
            creator:hub_profiles!matches_creator_hub_profile_fkey(
              id,
              alias,
              profile_picture_url,
              user_id
            ),
            venue:venues(
              id,
              name,
              address,
              image_url
            ),
            match_players(
              id,
              player_id,
              team,
              status
            )
          `)
          .eq('status', 'open')
          .eq('hub_id', HUBS.SOCCER)
          .order('created_at', { ascending: false });

        if (matchError) throw matchError;

        // Fetch user profiles for creators
        const userIds = matchesData?.map(match => match.creator?.user_id).filter(Boolean) || [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        const userMap = profiles?.reduce((acc, profile) => ({
          ...acc,
          [profile.id]: profile
        }), {}) || {};

        const formattedMatches = matchesData?.map(match => ({
          ...match,
          creator: {
            ...match.creator,
            name: match.creator?.alias ||
              (userMap[match.creator?.user_id]
                ? `${userMap[match.creator.user_id].first_name} ${userMap[match.creator.user_id].last_name}`
                : 'Anonymous Player')
          },
          venue: match.venue,
          players: match.match_players || []
        }));

        setMatches(formattedMatches || []);
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
};

export default useMatches;