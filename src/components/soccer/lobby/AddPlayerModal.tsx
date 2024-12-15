import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Search, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (player: Player) => void;
  maxPlayers?: number;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  isOpen,
  onClose,
  onAddPlayer,
  maxPlayers = 5
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [guestName, setGuestName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [guestPlayers, setGuestPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchGuestPlayers();
      setSearchTerm('');
      setError(null);
    }
  }, [isOpen]);

  const searchPlayers = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      const { data: searchResults, error: searchError } = await supabase
        .from('profiles')
        .select(`
          id,
          usernames!inner (
            username
          ),
          profile_picture_url
        `)
        .textSearch('usernames.username', term)
        .limit(maxPlayers);

      if (searchError) throw searchError;
      setSearchResults(searchResults || []);
    } catch (err) {
      console.error('Error searching players:', err);
      setError('Failed to search players');
    }
  };

  const fetchGuestPlayers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      const { data: guests, error: guestsError } = await supabase
        .from('guest_players')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (guestsError) throw guestsError;
      setGuestPlayers(guests || []);
    } catch (err) {
      console.error('Error fetching guest players:', err);
      setError('Failed to fetch guest players');
    }
  };

  const createGuestPlayer = async () => {
    if (!guestName.trim()) {
      setError('Please enter a name for the guest player');
      return;
    }

    if (!gender) {
      setError('Please select a gender');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data: guest, error: createError } = await supabase
        .from('guest_players')
        .insert({
          name: guestName.trim(),
          creator_id: profile.id,
          is_guest: true,
          skill_level: 'Beginner',
          years_experience: '0-1',
          gender: gender
        })
        .select()
        .single();

      if (createError) throw createError;

      const formattedGuest: Player = {
        id: guest.id,
        name: guest.name,
        profile_picture_url: guest.profile_picture_url,
        skill_level: guest.skill_level,
        years_experience: guest.years_experience,
        is_guest: true,
        gender: guest.gender,
        is_ready: false
      };

      onAddPlayer(formattedGuest);
      setGuestName('');
      setGender('');
      onClose();
    } catch (err) {
      console.error('Error creating guest player:', err);
      setError('Failed to create guest player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-gray-900/90 backdrop-blur-md rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-800"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-800/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h2 className="text-xl font-bold mb-6 text-white">Add Player</h2>

            {/* Search Players */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchPlayers(e.target.value);
                  }}
                  placeholder="Search players..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 
                    text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-[#573cff]/50 focus:border-[#573cff] transition-all"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {searchResults.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => {
                        onAddPlayer({
                          id: player.id,
                          name: player.usernames[0].username,
                          profile_picture_url: player.profile_picture_url,
                          skill_level: null,
                          years_experience: null,
                          is_guest: false,
                          is_ready: false
                        });
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 
                        transition-colors group"
                    >
                      {player.profile_picture_url ? (
                        <img
                          src={player.profile_picture_url}
                          alt={player.usernames[0].username}
                          className="w-10 h-10 rounded-full object-cover border border-gray-700 
                            group-hover:border-gray-600"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center 
                          justify-center border border-gray-700 group-hover:border-gray-600">
                          <span className="text-xl text-gray-400">
                            {player.usernames[0].username[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-300 group-hover:text-white">
                        {player.usernames[0].username}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Guest Player */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Add Guest Player</h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg 
                  text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest name..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 
                    text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-[#573cff]/50 focus:border-[#573cff] transition-all"
                />

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Select Gender:</p>
                  <div className="flex gap-4">
                    {['male', 'female'].map((option) => (
                      <label
                        key={option}
                        className="flex-1 relative"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={gender === option}
                          onChange={() => setGender(option as 'male' | 'female')}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className={`p-3 rounded-lg border ${
                          gender === option
                            ? 'bg-[#573cff]/20 border-[#573cff] text-white'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400'
                          } text-center cursor-pointer transition-all capitalize`}>
                          {option}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={createGuestPlayer}
                  disabled={loading || !guestName.trim() || !gender}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                    bg-[#573cff] hover:bg-[#573cff]/90 disabled:opacity-50 
                    disabled:hover:bg-[#573cff] transition-colors text-white font-medium"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{loading ? 'Adding...' : 'Add Guest'}</span>
                </button>
              </div>
            </div>

            {/* Recent Guest Players */}
            {guestPlayers.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Guests</h4>
                <div className="space-y-1">
                  {guestPlayers.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => {
                        onAddPlayer({
                          ...guest,
                          is_ready: false
                        });
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 
                        transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center 
                        justify-center border border-gray-700 group-hover:border-gray-600">
                        <span className="text-xl text-gray-400">
                          {guest.name[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-300 group-hover:text-white">
                        {guest.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPlayerModal;
