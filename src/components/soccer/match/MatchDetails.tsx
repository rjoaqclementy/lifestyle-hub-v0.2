import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trophy, Target, Car, Beer, Droplets, AlertCircle } from 'lucide-react';
import type { MatchRestrictions } from '../../../types/match';
import MatchActionsBar from './MatchActionsBar';  // Import the new component

interface MatchDetailsProps {
  match: any;
  venue: any;
  isAuthenticated: boolean;
}

const RestrictionBadge: React.FC<{ text: string }> = ({ text }) => (
  <div className="inline-flex items-center px-2 py-1 rounded bg-red-500/10 text-red-400 text-sm">
    <AlertCircle className="w-4 h-4 mr-1" />
    {text}
  </div>
);

const getRestrictionDescription = (restrictions: MatchRestrictions): string => {
  const parts = [];
  
  if (restrictions.gender === 'men-only') {
    parts.push('Men only');
  } else if (restrictions.gender === 'women-only') {
    parts.push('Women only');
  } else if (restrictions.gender === 'gender-ratio' && restrictions.genderRatio) {
    parts.push(`${restrictions.genderRatio.men}:${restrictions.genderRatio.women} M/W ratio`);
  }

  if (restrictions.age === 'under-18') {
    parts.push('Under 18');
  } else if (restrictions.age === 'over-18') {
    parts.push('Over 18');
  } else if (restrictions.age === 'custom' && restrictions.customAgeRange) {
    const { min, max } = restrictions.customAgeRange;
    if (min && max) {
      parts.push(`Ages ${min}-${max}`);
    } else if (min) {
      parts.push(`Ages ${min}+`);
    } else if (max) {
      parts.push(`Ages up to ${max}`);
    }
  }

  return parts.join(' • ');
};

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, venue, isAuthenticated }) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const renderRestrictions = (restrictions: MatchRestrictions) => {
    const badges = [];

    if (restrictions.gender === 'men-only') {
      badges.push(<RestrictionBadge key="men" text="Men Only" />);
    } else if (restrictions.gender === 'women-only') {
      badges.push(<RestrictionBadge key="women" text="Women Only" />);
    } else if (restrictions.gender === 'gender-ratio' && restrictions.genderRatio) {
      badges.push(
        <RestrictionBadge 
          key="ratio" 
          text={`${restrictions.genderRatio.men}M:${restrictions.genderRatio.women}W Ratio`} 
        />
      );
    }

    if (restrictions.age === 'under-18') {
      badges.push(<RestrictionBadge key="u18" text="Under 18" />);
    } else if (restrictions.age === 'over-18') {
      badges.push(<RestrictionBadge key="o18" text="Over 18" />);
    } else if (restrictions.age === 'custom' && restrictions.customAgeRange) {
      const { min, max } = restrictions.customAgeRange;
      badges.push(
        <RestrictionBadge 
          key="age" 
          text={`Age ${min || '0'}-${max || '∞'}`} 
        />
      );
    }

    return badges;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-500';
      case 'full':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Match Info */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold capitalize mb-2">
              {match.type} Match
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(match.status)}`}>
                {match.status.replace('_', ' ').charAt(0).toUpperCase() + match.status.slice(1)}
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm capitalize">
                {match.gender_preference}
              </span>
            </div>
          </div>
        </div>

        {/* Match Restrictions */}
        {match.restrictions && Object.keys(match.restrictions).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Match Restrictions</h3>
            <div className="flex flex-wrap gap-2">
              {renderRestrictions(match.restrictions)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Trophy className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Match Type</p>
              <p className="font-semibold capitalize">{match.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Team Size</p>
              <p className="font-semibold">{match.players_per_team}v{match.players_per_team}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Target className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Skill Level</p>
              <p className="font-semibold capitalize">{match.skill_level || 'All Levels'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Match Actions */}
      {isAuthenticated && <MatchActionsBar match={match} venue={venue} />}

      {/* Schedule & Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h3 className="font-semibold mb-6">Schedule & Location</h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Calendar className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-semibold">
                {new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Clock className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="font-semibold">
                {formatTime(match.time)} ({match.duration} minutes)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <MapPin className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Venue</p>
              <p className="font-semibold">{venue?.name}</p>
              <p className="text-gray-400 text-sm">{venue?.address}</p>
            </div>
          </div>

          {venue && (
            <div className="flex gap-4 mt-4 border-t border-gray-800 pt-4">
              {venue.has_parking && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Car className="w-4 h-4" />
                  <span>Parking</span>
                </div>
              )}
              {venue.has_bar && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Beer className="w-4 h-4" />
                  <span>Bar</span>
                </div>
              )}
              {venue.has_showers && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Droplets className="w-4 h-4" />
                  <span>Showers</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Additional Info */}
      {match.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="font-semibold mb-4">Additional Information</h3>
          <p className="text-gray-300">{match.description}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MatchDetails;