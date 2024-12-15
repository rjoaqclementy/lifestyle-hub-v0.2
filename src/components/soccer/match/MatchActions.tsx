import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, ClipboardList, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { validatePlayerEligibility } from '../../../utils/matchRestrictions';
import { joinMatch, leaveMatch } from '../../../services/matchService';
import JoinMatchModal from './JoinMatchModal';

interface MatchActionsProps {
  match: any;
  isPlayerInMatch: boolean;
  isInWaitingList: boolean;
  playerTeam?: string;
  isAuthenticated: boolean;
  onUpdate: () => void;
}

const MatchActions: React.FC<MatchActionsProps> = ({ 
  match, 
  isPlayerInMatch,
  isInWaitingList,
  playerTeam,
  isAuthenticated,
  onUpdate 
}) => {
  if (!isAuthenticated) {
    return null;
  }

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityReason, setEligibilityReason] = useState<string | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    checkEligibility();
  }, [match]);

  const checkEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsEligible(false);
        setEligibilityReason('You must be logged in to join matches');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        setIsEligible(false);
        setEligibilityReason('Profile not found');
        return;
      }

      const result = await validatePlayerEligibility(match.id, user.id, match.restrictions, profile);
      setIsEligible(result.isEligible);
      setEligibilityReason(result.reason || null);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setIsEligible(false);
      setEligibilityReason('Unable to verify eligibility');
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleLeaveMatch = async () => {
    try {
      setLoading(true);
      await leaveMatch(match.id);
      onUpdate();
    } catch (error) {
      console.error('Error leaving match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitingList = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: hubProfile } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', match.hub_id)
        .single();

      if (!hubProfile) throw new Error('No hub profile found');

      // Get current position in waiting list
      const { data: waitingList } = await supabase
        .from('match_waiting_list')
        .select('position')
        .eq('match_id', match.id)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = waitingList?.[0]?.position + 1 || 1;

      await supabase
        .from('match_waiting_list')
        .insert({
          match_id: match.id,
          player_id: hubProfile.id,
          position: nextPosition
        });

      onUpdate();
    } catch (error) {
      console.error('Error joining waiting list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveWaitingList = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: hubProfile } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', match.hub_id)
        .single();

      if (!hubProfile) throw new Error('No hub profile found');

      await supabase
        .from('match_waiting_list')
        .delete()
        .eq('match_id', match.id)
        .eq('player_id', hubProfile.id);

      onUpdate();
    } catch (error) {
      console.error('Error leaving waiting list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (team: string) => {
    try {
      setLoading(true);
      await joinMatch(match.id, team as 'home' | 'away');
      onUpdate();
      setShowJoinModal(false);
    } catch (error: any) {
      console.error('Error joining match:', error);
      setEligibilityReason(error.message || 'Failed to join match');
      setIsEligible(false);
    } finally {
      setLoading(false);
    }
  };

  const spotsLeft = match.players_per_team * 2 - (match.match_players?.length || 0);
  const isFull = match.status === 'full';

  return (
    <>
      {isPlayerInMatch ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">You're In!</h3>
                <p className="text-sm text-gray-400">
                  Playing on {playerTeam?.charAt(0).toUpperCase()}{playerTeam?.slice(1)} Team
                </p>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                Joined
              </div>
            </div>
            <button
              onClick={() => handleLeaveMatch()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
            >
              <UserMinus className="w-5 h-5" />
              <span>{loading ? 'Leaving...' : 'Leave Match'}</span>
            </button>
          </div>
        </motion.div>
      ) : isInWaitingList ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">You're on the Waiting List</h3>
              <p className="text-gray-400">We'll notify you when a spot opens up</p>
            </div>
            <button
              onClick={handleLeaveWaitingList}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
            >
              <UserMinus className="w-5 h-5" />
              <span>{loading ? 'Leaving...' : 'Leave Waiting List'}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">
                {isFull ? 'Match is Full' : `${spotsLeft} Spots Left`}
              </h3>
              {checkingEligibility ? (
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#573cff] border-t-transparent" />
                  <span>Checking eligibility...</span>
                </div>
              ) : !isEligible ? (
                <div className="flex items-start gap-2 mt-2 text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{eligibilityReason || 'You are not eligible to join this match'}</p>
                </div>
              ) : (
                <p className="text-gray-400 mt-2">
                  {isFull
                    ? 'Join the waiting list to get notified when a spot opens up'
                    : 'Join this match to secure your spot'}
                </p>
              )}
            </div>

            {isEligible && !checkingEligibility && (
              <button
                onClick={isFull ? handleJoinWaitingList : () => setShowJoinModal(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors btn-primary"
              >
                {isFull ? (
                  <>
                    <ClipboardList className="w-5 h-5" />
                    <span>{loading ? 'Joining...' : 'Join Waiting List'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>{loading ? 'Joining...' : 'Join Match'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {showJoinModal && !isFull && (
        <JoinMatchModal
          match={match}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinMatch}
          isOpen={showJoinModal}
        />
      )}
    </>
  );
};

export default MatchActions;