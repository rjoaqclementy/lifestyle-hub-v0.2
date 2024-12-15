import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Copy } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import LobbyCard from './LobbyCard';
import AddPlayerModal from './AddPlayerModal';

interface SportsPlayerProfile {
  id: string;
  skill_level: string | null;
  years_experience: string | null;
  player_card_url: string | null;
  sport_specific_data: Record<string, any> | null;
}

interface UserProfile {
  id: string;  
  alias?: string | null;
  profile_picture_url?: string | null;
  sports_player_profiles?: SportsPlayerProfile[]; 
}

interface Player {
  id: string;
  name?: string;
  profile_picture_url: string | null;
  skill_level: string | null;
  years_experience: string | null;
  is_guest: boolean;
  is_ready: boolean;
  gender?: 'male' | 'female';
}

interface Lobby {
  id: string;
  code: string;
  host_id: string;
  hub_id: string;
  is_private: boolean;
  status: 'open' | 'in_game' | 'closed';
}

export const LobbyManager = ({ hubId, userProfile }: { hubId: string; userProfile: UserProfile }) => {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLobbyCode, setShowLobbyCode] = useState(false);

  useEffect(() => {
    initializeLobby();
  }, []);

  useEffect(() => {
    if (!hubId || !lobby?.id) return;
    fetchLobbyPlayers(lobby.id);
  }, [hubId, lobby?.id]);

  useEffect(() => {
    if (!hubId || !lobby?.id) return;

    const lobbySubscription = supabase
      .channel(`lobby:${lobby.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lobby_members',
        filter: `lobby_id=eq.${lobby.id}`
      }, () => {
        console.log('Change detected in lobby_members, refetching players...');
        fetchLobbyPlayers(lobby.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(lobbySubscription);
    };
  }, [hubId, lobby?.id]);

  const initializeLobby = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) throw new Error('Profile not found');

      const { data: existingLobby, error: existingLobbyError } = await supabase
        .from('lobbies')
        .select('*')
        .eq('host_id', profile.id)
        .eq('hub_id', hubId)
        .single();

      if (existingLobbyError && existingLobbyError.code !== 'PGRST116') {
        throw existingLobbyError;
      }

      let currentLobby = existingLobby;

      if (!existingLobby) {
        const { data: newLobby, error: createError } = await supabase
          .from('lobbies')
          .insert({
            host_id: profile.id,
            hub_id: hubId,
            code: generateLobbyCode(),
            status: 'open',
            is_private: false
          })
          .select()
          .single();

        if (createError) throw createError;
        currentLobby = newLobby;

        const { error: memberError } = await supabase
          .from('lobby_members')
          .insert({
            lobby_id: newLobby.id,
            user_id: profile.id,
            is_ready: false
          });

        if (memberError) throw memberError;
      }

      setLobby(currentLobby);
    } catch (err: any) {
      console.error('Error initializing lobby:', err);
      setError(err.message || 'Failed to initialize lobby');
    } finally {
      setLoading(false);
    }
  };

  const fetchLobbyPlayers = async (lobbyId: string) => {
    try {
      const { data: members, error: membersError } = await supabase
        .from('lobby_members')
        .select(`
          id,
          is_ready,
          user_id,
          profiles:user_id (
            id,
            profile_picture_url
          ),
          guest_players:guest_id (
            id,
            name,
            profile_picture_url,
            skill_level,
            years_experience,
            is_guest,
            gender
          )
        `)
        .eq('lobby_id', lobbyId);

      if (membersError) throw membersError;

      if (!members || members.length === 0) {
        setPlayers([]);
        return;
      }

      // Get user IDs for hub profile lookup
      const userIds = members.filter(m => m.user_id).map(m => m.user_id);

      // Fetch hub profiles for all users
      let hubProfileMap = new Map<string, { alias?: string; player_card_url?: string }>();
      if (userIds.length > 0 && hubId) {
        const { data: hubProfileData } = await supabase
          .from('hub_profiles')
          .select(`
            user_id,
            alias,
            sports_player_profiles (
              player_card_url
            )
          `)
          .eq('hub_id', hubId)
          .in('user_id', userIds);

        if (hubProfileData) {
          hubProfileData.forEach((hp: any) => {
            const playerCardUrl = hp.sports_player_profiles?.[0]?.player_card_url || null;
            hubProfileMap.set(hp.user_id, {
              alias: hp.alias,
              player_card_url: playerCardUrl
            });
          });
        }
      }

      const formattedPlayers = members.map(member => {
        if (member.profiles) {
          const userData = hubProfileMap.get(member.user_id) || {};
          let alias = userData.alias || 'Anonymous';
          let playerCardUrl = userData.player_card_url || member.profiles.profile_picture_url || null;

          if (member.user_id === userProfile?.id) {
            const userCard = userProfile.sports_player_profiles?.[0]?.player_card_url;
            const userAlias = userProfile.alias;
            if (userCard) playerCardUrl = userCard;
            if (userAlias) alias = userAlias;
          }

          return {
            id: member.profiles.id,
            name: alias,
            profile_picture_url: playerCardUrl,
            skill_level: null,
            years_experience: null,
            is_guest: false,
            is_ready: member.is_ready
          };
        } else if (member.guest_players) {
          return {
            id: member.guest_players.id,
            name: member.guest_players.name,
            profile_picture_url: member.guest_players.profile_picture_url,
            skill_level: member.guest_players.skill_level,
            years_experience: member.guest_players.years_experience,
            is_guest: true,
            gender: member.guest_players.gender,
            is_ready: member.is_ready
          };
        }
        return null;
      }).filter(Boolean) as Player[];

      setPlayers(formattedPlayers);
    } catch (err: any) {
      console.error('Error in fetchLobbyPlayers:', err);
      setError(err.message || 'Failed to load players');
    }
  };

// To be continued in Part 2...
const handleAddPlayer = async (player: Player) => {
    if (!lobby) return;

    try {
      const { error } = await supabase
        .from('lobby_members')
        .insert({
          lobby_id: lobby.id,
          [player.is_guest ? 'guest_id' : 'user_id']: player.id,
          is_ready: false
        });

      if (error) throw error;
      await fetchLobbyPlayers(lobby.id);
    } catch (err) {
      console.error('Error adding player:', err);
      setError('Failed to add player to lobby');
    }
  };

  const handleRemovePlayer = async (playerId: string, isGuest: boolean) => {
    if (!lobby) return;

    try {
      const { error } = await supabase
        .from('lobby_members')
        .delete()
        .eq('lobby_id', lobby.id)
        .eq(isGuest ? 'guest_id' : 'user_id', playerId);

      if (error) throw error;
      await fetchLobbyPlayers(lobby.id);
    } catch (err) {
      console.error('Error removing player:', err);
      setError('Failed to remove player');
    }
  };

  const handleToggleReady = async (playerId: string, isGuest: boolean) => {
    if (!lobby) return;

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('lobby_members')
        .select('is_ready')
        .eq('lobby_id', lobby.id)
        .eq(isGuest ? 'guest_id' : 'user_id', playerId)
        .single();

      if (memberError) throw memberError;

      const { error } = await supabase
        .from('lobby_members')
        .update({ is_ready: !memberData?.is_ready })
        .eq('lobby_id', lobby.id)
        .eq(isGuest ? 'guest_id' : 'user_id', playerId);

      if (error) throw error;
      await fetchLobbyPlayers(lobby.id);
    } catch (err) {
      console.error('Error toggling ready state:', err);
      setError('Failed to update ready state');
    }
  };

  const generateLobbyCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#573cff]" />
      </div>
    );
  }

  return (
    <div className="relative pt-24 min-h-screen">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Lobby Code Header */}
        {lobby && (
          <div 
            onClick={() => setShowLobbyCode(true)}
            className="mx-auto max-w-xs bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm 
              border border-gray-700/50 cursor-pointer hover:bg-gray-800/70 transition-colors mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#573cff]" />
                <div>
                  <p className="text-sm text-gray-400">Lobby Code</p>
                  <p className="font-mono font-bold">{lobby.code}</p>
                </div>
              </div>
              <Copy className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Players Layout */}
        <div className="relative flex justify-center items-center h-[460px]">
          <div className="flex items-center gap-6">
            {players.map((player, index) => {
              // Calculate positions for Valorant-style layout
              let translateY = '0px';
              if (index !== 0) { // If not the host
                translateY = '80px';
              }
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ transform: `translateY(${translateY})` }}
                >
                  <LobbyCard
                    profile={player}
                    isHost={index === 0}
                    isReady={player.is_ready}
                    onRemove={() => handleRemovePlayer(player.id, player.is_guest)}
                    onToggleReady={() => handleToggleReady(player.id, player.is_guest)}
                  />
                </motion.div>
              );
            })}

            {players.length < 5 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: players.length * 0.1 }}
                style={{ transform: 'translateY(80px)' }}
                className="w-[160px] aspect-[9/16] rounded-lg border-2 border-dashed 
                  border-gray-700/50 hover:border-gray-600/50 transition-colors group
                  flex flex-col items-center justify-center"
                onClick={() => setShowAddModal(true)}
              >
                <div className="text-center text-gray-600 group-hover:text-gray-500">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">ADD PLAYER</span>
                </div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="fixed bottom-0 inset-x-0 p-6 flex justify-center gap-4">
          <button className="px-8 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded text-gray-300 
            backdrop-blur-sm transition-colors">
            PRACTICE
          </button>
          <button className="px-12 py-2 bg-red-500 hover:bg-red-600 rounded font-medium 
            transition-colors">
            START
          </button>
          <button className="px-8 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded text-gray-300 
            backdrop-blur-sm transition-colors">
            LEAVE LOBBY
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 
            bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Modals */}
        <AddPlayerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddPlayer={handleAddPlayer}
          maxPlayers={5}
        />

        {/* Lobby Code Modal */}
        <AnimatePresence>
          {showLobbyCode && lobby && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowLobbyCode(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-gray-900/90 backdrop-blur-md rounded-lg shadow-xl 
                  w-full max-w-md p-6 border border-gray-800"
              >
                <h2 className="text-xl font-bold mb-4">Lobby Code</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Share this code with other players to join your lobby:
                </p>
                
                <div className="relative bg-gray-800 rounded-lg p-4 mb-6">
                  <code className="font-mono text-xl text-white">{lobby.code}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(lobby.code);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                      hover:text-white transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowLobbyCode(false)}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg 
                    transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LobbyManager;


