import { supabase } from '../supabase';

export const getMatchDetails = async (matchId: string) => {
  const { data: match, error } = await supabase
    .from('matches')
    .select(`
      *,
      venue:venues(*),
      match_players(
        *,
        player:profiles(
          id,
          full_name,
          profile_picture_url
        )
      )
    `)
    .eq('id', matchId)
    .single();

  if (error) {
    throw error;
  }

  return match;
};

export const getMatchPlayers = async (matchId: string) => {
  const { data: players, error } = await supabase
    .from('match_players')
    .select(`
      *,
      player:profiles(
        id,
        full_name,
        profile_picture_url
      )
    `)
    .eq('match_id', matchId);

  if (error) {
    throw error;
  }

  return players;
};