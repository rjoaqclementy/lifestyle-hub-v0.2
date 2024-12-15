import React from 'react';
import { motion } from 'framer-motion';

interface StatItemProps {
  label: string;
  value: number | string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

interface PlayerStatsProps {
  stats: {
    matches_played?: number;
    goals_scored?: number;
    win_rate?: string;
    mvp_awards?: number;
  };
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatItem label="Matches Played" value={stats?.matches_played || 0} />
        <StatItem label="Goals Scored" value={stats?.goals_scored || 0} />
        <StatItem label="Win Rate" value={stats?.win_rate || '0%'} />
        <StatItem label="MVP Awards" value={stats?.mvp_awards || 0} />
      </div>
    </motion.div>
  );
};