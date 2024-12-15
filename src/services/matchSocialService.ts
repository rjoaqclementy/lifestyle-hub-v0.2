import { supabase } from '../lib/supabase';

export interface MatchSocialStatus {
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
}

export const matchSocialService = {
  // Get social status for a match
  async getMatchSocialStatus(matchId: string): Promise<MatchSocialStatus> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [{ data: likes }, { data: saves }, { data: match }] = await Promise.all([
        supabase
          .from('match_likes')
          .select('id')
          .eq('match_id', matchId)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('match_saves')
          .select('id')
          .eq('match_id', matchId)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('matches')
          .select('likes_count')
          .eq('id', matchId)
          .single()
      ]);

      return {
        isLiked: !!likes,
        isSaved: !!saves,
        likesCount: match?.likes_count || 0
      };
    } catch (error) {
      console.error('Error getting match social status:', error);
      return {
        isLiked: false,
        isSaved: false,
        likesCount: 0
      };
    }
  },

  // Toggle like status
  async toggleLike(matchId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existingLike } = await supabase
        .from('match_likes')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('match_likes')
          .delete()
          .eq('match_id', matchId)
          .eq('user_id', user.id);
        return false;
      } else {
        // Like
        await supabase
          .from('match_likes')
          .insert({ match_id: matchId, user_id: user.id });
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  },

  // Toggle save status
  async toggleSave(matchId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existingSave } = await supabase
        .from('match_saves')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', user.id)
        .single();

      if (existingSave) {
        // Unsave
        await supabase
          .from('match_saves')
          .delete()
          .eq('match_id', matchId)
          .eq('user_id', user.id);
        return false;
      } else {
        // Save
        await supabase
          .from('match_saves')
          .insert({ match_id: matchId, user_id: user.id });
        return true;
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      return false;
    }
  }
};