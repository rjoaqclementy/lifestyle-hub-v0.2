import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useMatch from '../../hooks/useMatch';
import MatchDetails from '../../components/soccer/match/MatchDetails';
import MatchOrganizer from '../../components/soccer/match/MatchOrganizer';
import PlayersList from '../../components/soccer/match/PlayersList';
import MatchActions from '../../components/soccer/match/MatchActions';
import AdminControls from '../../components/soccer/match/AdminControls';
import EditMatchModal from '../../components/soccer/match/EditMatchModal';
import ManagePlayersModal from '../../components/soccer/match/ManagePlayersModal';
import DistributeTeamsModal from '../../components/soccer/match/DistributeTeamsModal';
import MatchActionsBar from '../../components/soccer/match/MatchActionsBar';

const Match = () => {
  const navigate = useNavigate();
  const { match, loading, error, isOrganizer, currentUserHubProfile, isInWaitingList } = useMatch();
  const [isAdminView, setIsAdminView] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManagePlayersModal, setShowManagePlayersModal] = useState(false);
  const [showDistributeTeamsModal, setShowDistributeTeamsModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const handleToggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };

  const handleUpdateMatch = async () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Match</h2>
          <p className="text-gray-400 mb-4">Unable to load match details.</p>
          <button
            onClick={() => navigate('/soccer/play')}
            className="btn-primary"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  const isPlayerInMatch = match.match_players?.some(
    p => p.player_id === currentUserHubProfile?.id
  );

  const playerTeam = match.match_players?.find(
    p => p.player_id === currentUserHubProfile?.id
  )?.team;

  const canViewPlayersList = match.players_list_public || 
                           (isOrganizer && isAdminView) || 
                           isPlayerInMatch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900"
    >
      <header className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/soccer/play')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">Match Details</h1>
          <div className="flex items-center gap-2">
            {isOrganizer && isAuthenticated && (
              <button
                onClick={handleToggleAdminView}
                className={`p-2 rounded-lg transition-colors ${
                  isAdminView ? 'bg-[#573cff] text-white' : 'hover:bg-gray-800'
                }`}
                title={isAdminView ? 'Exit Admin View' : 'Enter Admin View'}
              >
                {isAdminView ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  localStorage.setItem('pendingMatchRedirect', match.id);
                  navigate('/auth');
                }}
                className="btn-primary px-4 py-2"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isAuthenticated && isOrganizer && isAdminView && (
              <AdminControls
                isAdmin={isOrganizer}
                match={match}
                onEditMatch={() => setShowEditModal(true)}
                onManagePlayers={() => setShowManagePlayersModal(true)}
                onDistributeTeams={() => setShowDistributeTeamsModal(true)}
                onUpdate={handleUpdateMatch}
              />
            )}
            <MatchDetails 
              match={match} 
              venue={match.venue}
              isAuthenticated={isAuthenticated} 
            />
          </div>

          <div className="space-y-6">
            <MatchActions
              match={match}
              isPlayerInMatch={isPlayerInMatch}
              isInWaitingList={isInWaitingList}
              playerTeam={playerTeam}
              onUpdate={handleUpdateMatch}
              isAuthenticated={isAuthenticated}
            />

            <MatchOrganizer creator={match.creator} />
            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 text-center"
              >
                <h3 className="text-lg font-semibold mb-2">Players List</h3>
                <p className="text-gray-400 mb-4">Sign in to view the players list and join this match</p>
              </motion.div>
            ) : (
              <PlayersList 
                players={match.match_players || []} 
                totalSlots={match.players_per_team * 2}
                showPrivate={canViewPlayersList}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <>
          {showEditModal && (
            <EditMatchModal
              match={match}
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              onUpdate={handleUpdateMatch}
            />
          )}

          {showManagePlayersModal && (
            <ManagePlayersModal
              match={match}
              isOpen={showManagePlayersModal}
              onClose={() => setShowManagePlayersModal(false)}
              players={match.match_players || []}
              onUpdate={handleUpdateMatch}
            />
          )}

          {showDistributeTeamsModal && (
            <DistributeTeamsModal
              match={match}
              isOpen={showDistributeTeamsModal}
              onClose={() => setShowDistributeTeamsModal(false)}
              players={match.match_players || []}
              onUpdate={handleUpdateMatch}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Match;