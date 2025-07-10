"use client";

import { useState } from 'react';
import { X402FeedList } from './X402ForYouFeed';
import { NeynarUser } from '@/lib/api/types';

interface InteractiveFeedProps {
  initialFid?: number;
}

export function InteractiveFeed({ initialFid = 3 }: InteractiveFeedProps) {
  const [selectedFid, setSelectedFid] = useState<number>(initialFid);
  const [customFid, setCustomFid] = useState('');
  const [userInfo, setUserInfo] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Popular FIDs for quick selection
  const popularUsers = [
    { fid: 3, name: "dwr.eth", description: "Dan Romero - Farcaster" },
    { fid: 2, name: "Dan Romero", description: "Co-founder of Farcaster" },
    { fid: 5650, name: "jessepollak", description: "Jesse Pollak - Base" },
    { fid: 1, name: "Farcaster", description: "Official Farcaster" },
    { fid: 6833, name: "quazia", description: "Quazia" },
    { fid: 239, name: "vitalik.eth", description: "Vitalik Buterin" },
  ];

  const handleFidChange = async (fid: number) => {
    setSelectedFid(fid);
    setUserInfo(null);
    
    // Fetch user info for display
    try {
      setLoading(true);
      const response = await fetch(`/api/users/lookup?fid=${fid}`);
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomFidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fid = parseInt(customFid);
    if (!isNaN(fid) && fid > 0) {
      handleFidChange(fid);
      setCustomFid('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
      {/* Header with FID Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">For You Feed</h2>
          <div className="flex items-center gap-2">
            <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-sm font-medium">
              🔥 Live via x402
            </span>
            <span className="bg-blue-600 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">
              Base Network
            </span>
          </div>
        </div>

        {/* User Info Display */}
        {userInfo && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={userInfo.pfp_url} 
                alt={userInfo.display_name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-white">{userInfo.display_name}</h3>
                <p className="text-gray-400 text-sm">@{userInfo.username} • FID: {userInfo.fid}</p>
                <p className="text-gray-300 text-sm">{userInfo.follower_count?.toLocaleString()} followers</p>
              </div>
            </div>
          </div>
        )}

        {/* FID Selection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Popular Users</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularUsers.map((user) => (
                <button
                  key={user.fid}
                  onClick={() => handleFidChange(user.fid)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selectedFid === user.fid
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs opacity-75">FID: {user.fid}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom FID Input */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Enter Custom FID</h3>
            <form onSubmit={handleCustomFidSubmit} className="flex gap-2">
              <input
                type="number"
                value={customFid}
                onChange={(e) => setCustomFid(e.target.value)}
                placeholder="Enter any FID (e.g., 14206)"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <button
                type="submit"
                disabled={!customFid || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '...' : 'Load'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <X402FeedList
        fid={selectedFid}
        limit={25}
      />
    </div>
  );
}
