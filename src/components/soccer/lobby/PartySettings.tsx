import React from 'react';
import { Users, Crown, Copy } from 'lucide-react';

interface PartySettingsProps {
  partyCode: string;
  onCopyCode: () => void;
}

const PartySettings = ({ partyCode, onCopyCode }: PartySettingsProps) => {
  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Party Settings
          </h2>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-400">Party Leader</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Party Code</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 block px-4 py-2 rounded-lg bg-gray-800 font-mono">
                {partyCode}
              </code>
              <button 
                onClick={onCopyCode}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="btn-primary">
            Start Match
          </button>
          <button className="border border-gray-700 hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartySettings;