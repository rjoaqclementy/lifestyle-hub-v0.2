import React from 'react';

const MatchSettings = () => {
  return (
    <div className="card">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Match Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Match Type
            </label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <option>Casual 5v5</option>
              <option>Competitive</option>
              <option>Practice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Location
            </label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <option>Any Available</option>
              <option>Nearby Fields</option>
              <option>Premium Venues</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSettings;