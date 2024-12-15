import { supabase } from '../lib/supabase';
import type { MatchRestrictions } from '../types/match';

interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
}

export const validatePlayerEligibility = async (
  matchId: string,
  playerId: string,
  restrictions: MatchRestrictions,
  profile: any
): Promise<EligibilityResult> => {
  try {
    if (!profile) {
      return { isEligible: false, reason: 'Profile not found' };
    }

    // Get match details to check gender preference
    const { data: match } = await supabase
      .from('matches')
      .select('gender_preference')
      .eq('id', matchId)
      .single();

    // Debug logs
    console.log('Match:', matchId);
    console.log('Match Gender Preference:', match?.gender_preference);
    console.log('Restrictions:', restrictions);
    console.log('Profile:', profile);

    // Get hub profile and sports profile
    const { data: hubProfile, error: hubError } = await supabase
      .from('hub_profiles')
      .select(`
        id,
        sports_player_profiles!inner(
          skill_level,
          years_experience
        )
      `)
      .eq('user_id', playerId)
      .single();

    if (hubError) {
      return { 
        isEligible: false, 
        reason: 'You must complete your sports profile first' 
      };
    }

    // Check if restrictions exist
    if (!restrictions) {
      return { isEligible: true };
    }

    // Validate gender restrictions
    if ((restrictions.gender === 'men-only' || restrictions.gender === 'men' || match?.gender_preference === 'men') && profile.gender !== 'male') {
      return { 
        isEligible: false, 
        reason: 'This match is for men only' 
      };
    }

    if ((restrictions.gender === 'women-only' || restrictions.gender === 'women' || match?.gender_preference === 'women') && profile.gender !== 'female') {
      return { 
        isEligible: false, 
        reason: 'This match is for women only' 
      };
    }

    if (restrictions.gender === 'gender-ratio' && restrictions.genderRatio) {
      // Get current players
      const { data: players } = await supabase
        .from('match_players')
        .select(`
          player:hub_profiles!inner(
            user:profiles!inner(gender)
          )
        `)
        .eq('match_id', matchId);

      if (players) {
        const menCount = players.filter(p => p.player.user.gender === 'male').length;
        const womenCount = players.filter(p => p.player.user.gender === 'female').length;
        const { men: targetMen, women: targetWomen } = restrictions.genderRatio;
        
        if (profile.gender === 'male') {
          if ((menCount + 1) / (womenCount || 1) > targetMen / targetWomen) {
            return {
              isEligible: false,
              reason: `Maximum number of male players reached (${targetMen}M:${targetWomen}W ratio required)`
            };
          }
        } else if (profile.gender === 'female') {
          if (menCount / ((womenCount + 1) || 1) < targetMen / targetWomen) {
            return {
              isEligible: false,
              reason: `Maximum number of female players reached (${targetMen}M:${targetWomen}W ratio required)`
            };
          }
        }
      }
    }

    // Validate age restrictions
    if (profile.birthday) {
      const age = calculateAge(new Date(profile.birthday));

      if (restrictions.age === 'under-18' && age >= 18) {
        return {
          isEligible: false,
          reason: 'This match is for players under 18'
        };
      }

      if (restrictions.age === 'over-21' && age < 21) {
        return {
          isEligible: false,
          reason: 'This match is for players over 21'
        };
      }

      if (restrictions.age === 'over-18' && age < 18) {
        return {
          isEligible: false,
          reason: 'This match is for players over 18'
        };
      }

      if (restrictions.age === 'custom' && restrictions.customAgeRange) {
        if (restrictions.customAgeRange.min && age < restrictions.customAgeRange.min) {
          return {
            isEligible: false,
            reason: `Minimum age requirement is ${restrictions.customAgeRange.min}`
          };
        }
        if (restrictions.customAgeRange.max && age > restrictions.customAgeRange.max) {
          return {
            isEligible: false,
            reason: `Maximum age requirement is ${restrictions.customAgeRange.max}`
          };
        }
      }
    }

    // Validate skill level
    if (!restrictions.skillLevel.includes('all') && hubProfile?.sports_player_profiles[0]) {
      const playerSkill = hubProfile.sports_player_profiles[0].skill_level;
      if (!restrictions.skillLevel.includes(playerSkill.toLowerCase())) {
        return {
          isEligible: false,
          reason: `This match requires ${restrictions.skillLevel.join(' or ')} skill level`
        };
      }
    }

    // Check max players
    if (restrictions.maxPlayers) {
      const { count } = await supabase
        .from('match_players')
        .select('*', { count: 'exact' })
        .eq('match_id', matchId);

      if (count && count >= restrictions.maxPlayers) {
        return {
          isEligible: false,
          reason: 'Match is full'
        };
      }
    }

    return { isEligible: true };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return {
      isEligible: false,
      reason: 'Unable to verify eligibility'
    };
  }
};

const calculateAge = (birthday: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  
  return age;
};