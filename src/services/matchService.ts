import { supabase } from '../lib/supabase';
import { HUBS } from '../lib/constants';
import { validatePlayerEligibility } from '../utils/matchRestrictions';

interface MatchData {
  type: string;
  date: string;
  time: string;
  duration: number;
  players_per_team: number;
  venue_id: string;
  description?: string;
  gender_preference: 'mixed' | 'men' | 'women';
  skill_level: string;
  restrictions?: any;
}

export const createMatch = async (matchData: MatchData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Get user's hub profile
    const { data: hubProfile, error: hubError } = await supabase
      .from('hub_profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('hub_id', HUBS.SOCCER)
      .single();

    if (hubError) throw hubError;

    // Create the match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        creator_id: hubProfile.id,
        hub_id: HUBS.SOCCER,
        type: matchData.type,
        date: matchData.date,
        time: matchData.time,
        duration: parseInt(String(matchData.duration)),
        players_per_team: parseInt(String(matchData.players_per_team)),
        venue_id: matchData.venue_id,
        description: matchData.description,
        gender_preference: matchData.gender_preference,
        skill_level: matchData.skill_level,
        restrictions: matchData.restrictions
      })
      .select()
      .single();

    if (matchError) throw matchError;

    // Add creator as first player
    const { error: playerError } = await supabase
      .from('match_players')
      .insert({
        match_id: match.id,
        player_id: hubProfile.id,
        team: 'home',
        status: 'ready'
      });

    if (playerError) throw playerError;

    return match;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const joinMatch = async (matchId: string, team: 'home' | 'away') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // First get the match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError) throw matchError;

    // Get user profile and hub profile in parallel
    const [profileResponse, hubProfileResponse] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
      supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', HUBS.SOCCER)
        .single()
    ]);

    if (profileResponse.error) throw profileResponse.error;
    if (hubProfileResponse.error) throw hubProfileResponse.error;

    const profile = profileResponse.data;
    const hubProfile = hubProfileResponse.data;

    // Get existing players
    const { data: existingPlayers } = await supabase
      .from('match_players')
      .select('*')
      .eq('match_id', matchId);

    // Check if player is already in the match
    const existingPlayer = existingPlayers?.find(p => p.player_id === hubProfile.id);
    if (existingPlayer) {
      throw new Error('You are already in this match');
    }

    // Validate player eligibility
    const eligibilityResult = await validatePlayerEligibility(matchId, user.id, match.restrictions, profile);
    if (!eligibilityResult.isEligible) {
      throw new Error(eligibilityResult.reason);
    }

    // Join the match
    const { error: joinError } = await supabase
      .from('match_players')
      .insert({
        match_id: matchId,
        player_id: hubProfile.id,
        team,
        status: 'joined'
      });

    if (joinError) throw joinError;

    return { success: true };
  } catch (error) {
    console.error('Error joining match:', error);
    throw error;
  }
};

export const leaveMatch = async (matchId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Get user's hub profile
    const { data: hubProfile, error: profileError } = await supabase
      .from('hub_profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('hub_id', HUBS.SOCCER)
      .single();

    if (profileError) throw profileError;

    // Delete match player entry
    const { error: deleteError } = await supabase
      .from('match_players')
      .delete()
      .eq('match_id', matchId)
      .eq('player_id', hubProfile.id);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Error leaving match:', error);
    throw error;
  }
};