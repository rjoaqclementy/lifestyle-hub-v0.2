import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Link2, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface MatchActionsBarProps {
  match: any;
  venue: any;
}

interface SocialStatus {
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
}

const MatchActionsBar: React.FC<MatchActionsBarProps> = ({
  match,
  venue
}) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialStatus, setSocialStatus] = useState<SocialStatus>({
    isLiked: false,
    isSaved: false,
    likesCount: 0
  });

  useEffect(() => {
    loadSocialStatus();
  }, [match.id]);

  const loadSocialStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: likes }, { data: saves }, { data: matchData }] = await Promise.all([
        supabase
          .from('match_likes')
          .select('id')
          .eq('match_id', match.id)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('match_saves')
          .select('id')
          .eq('match_id', match.id)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('matches')
          .select('likes_count')
          .eq('id', match.id)
          .single()
      ]);

      setSocialStatus({
        isLiked: !!likes,
        isSaved: !!saves,
        likesCount: matchData?.likes_count || 0
      });
    } catch (error) {
      console.error('Error loading social status:', error);
    }
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingLike } = await supabase
        .from('match_likes')
        .select('id')
        .eq('match_id', match.id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('match_likes')
          .delete()
          .eq('match_id', match.id)
          .eq('user_id', user.id);

        setSocialStatus(prev => ({
          ...prev,
          isLiked: false,
          likesCount: Math.max(0, prev.likesCount - 1)
        }));
      } else {
        await supabase
          .from('match_likes')
          .insert({ match_id: match.id, user_id: user.id });

        setSocialStatus(prev => ({
          ...prev,
          isLiked: true,
          likesCount: prev.likesCount + 1
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingSave } = await supabase
        .from('match_saves')
        .select('id')
        .eq('match_id', match.id)
        .eq('user_id', user.id)
        .single();

      if (existingSave) {
        await supabase
          .from('match_saves')
          .delete()
          .eq('match_id', match.id)
          .eq('user_id', user.id);

        setSocialStatus(prev => ({
          ...prev,
          isSaved: false
        }));
      } else {
        await supabase
          .from('match_saves')
          .insert({ match_id: match.id, user_id: user.id });

        setSocialStatus(prev => ({
          ...prev,
          isSaved: true
        }));
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/m/${match.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const time = new Date(`2000-01-01T${match.time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
    
    const date = new Date(match.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const shareUrl = `${window.location.origin}/m/${match.id}`;
    const message = encodeURIComponent(
      `Hey! Want to join a ${match.type} soccer match?\n\n` +
      `📅 ${date}\n` +
      `⏰ ${time} (${match.duration} minutes)\n` +
      `📍 ${venue.name}\n` +
      `👥 ${match.players_per_team}v${match.players_per_team} | ${match.skill_level}\n\n` +
      `Join here: ${shareUrl}`
    );
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 mb-6"
    >
      <div className="flex items-center justify-around">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            socialStatus.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart 
            className={`w-6 h-6 ${socialStatus.isLiked ? 'fill-current' : ''}`} 
          />
          <span className="text-xs">
            {socialStatus.likesCount} {socialStatus.likesCount === 1 ? 'Like' : 'Likes'}
          </span>
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            socialStatus.isSaved ? 'text-[#573cff]' : 'text-gray-400 hover:text-[#573cff]'
          }`}
        >
          <Bookmark 
            className={`w-6 h-6 ${socialStatus.isSaved ? 'fill-current' : ''}`} 
          />
          <span className="text-xs">Save</span>
        </button>

        <button
          onClick={handleCopyLink}
          disabled={loading}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-[#573cff] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-6 h-6 text-green-500" />
              <span className="text-xs text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-6 h-6" />
              <span className="text-xs">Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={handleWhatsAppShare}
          disabled={loading}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-[#25D366] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-xs">WhatsApp</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MatchActionsBar;