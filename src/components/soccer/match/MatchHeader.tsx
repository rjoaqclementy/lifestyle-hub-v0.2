import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Settings } from 'lucide-react';

interface MatchHeaderProps {
  isCreator: boolean;
}

const MatchHeader = ({ isCreator }: MatchHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/soccer/play')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">Match Details</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          {isCreator && (
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MatchHeader;