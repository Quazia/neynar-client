"use client";

import { useState } from 'react';
import { X402FeedList } from './X402ForYouFeed';
import { NeynarUser } from '@/lib/api/types';

export function FeedExplorer() {
  const [fid, setFid] = useState<string>('');
  const [activeFid, setActiveFid] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fid.trim()) return;

    const fidNumber = parseInt(fid.trim());
    if (isNaN(fidNumber) || fidNumber <= 0) {
      setError('Please enter a valid FID number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUserInfo(null);
      
      console.log(`🔍 Looking up user info for FID: ${fidNumber}`);
      // First get user info by FID
      const response = await fetch(`/api/users/lookup?fid=${fidNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found with this FID');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUserInfo(data.user);
      setActiveFid(fidNumber);
      console.log(`✅ User info loaded for FID ${fidNumber}:`, data.user);
    } catch (err) {
      console.error('Failed to lookup user by FID:', err);
      setError(err instanceof Error ? err.message : 'Failed to lookup user');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFid('');
    setActiveFid(null);
    setUserInfo(null);
    setError(null);
  };

  const popularFids = [
    { fid: 3, name: 'dwr.eth', description: 'Farcaster Co-founder' },
    { fid: 2, name: 'Dan Romero', description: 'Farcaster CEO' },
    { fid: 5650, name: 'Jesse Pollak', description: 'Base' },
    { fid: 1, name: 'Farcaster', description: 'Official Account' },
    { fid: 14206, name: 'Neynar', description: 'Neynar Official' },
  ];

  return (
    <div className="space-y-6">
      {/* FID Lookup Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <span>🎯</span>
          Explore Any User's Feed
        </h3>
        
        <form onSubmit={handleExplore} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="number"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              placeholder="Enter FID (e.g., 3, 2, 5650)"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !fid.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Explore</span>
                </>
              )}
            </button>
          </div>
          
          {activeFid && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              <span>✕</span>
              <span>Clear</span>
            </button>
          )}
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-600 rounded-lg p-3">
            <p className="text-red-200 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </p>
          </div>
        )}

        {/* Popular FIDs */}
        <div className="mt-6">
          <p className="text-sm text-gray-400 mb-3">✨ Try these popular users:</p>
          <div className="flex flex-wrap gap-2">
            {popularFids.map((user) => (
              <button
                key={user.fid}
                onClick={() => {
                  setFid(user.fid.toString());
                  handleExplore(new Event('submit') as any);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1 rounded-full text-xs transition-colors"
                disabled={loading}
              >
                FID {user.fid} - {user.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Info Display */}
      {userInfo && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={userInfo.pfp_url}
              alt={userInfo.display_name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="text-xl font-bold text-white">{userInfo.display_name}</h4>
              <p className="text-gray-400">@{userInfo.username} • FID {activeFid}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                <span>{userInfo.follower_count?.toLocaleString()} followers</span>
                <span>{userInfo.following_count?.toLocaleString()} following</span>
              </div>
            </div>
          </div>
          
          {userInfo.profile?.bio?.text && (
            <p className="text-gray-300 text-sm mb-4">{userInfo.profile.bio.text}</p>
          )}
          
          <div className="bg-gradient-to-r from-green-900 to-green-800 border border-green-700 rounded-lg p-3">
            <p className="text-green-100 text-sm flex items-center gap-2">
              ⚡ Loading personalized "For You" feed via x402 payments...
            </p>
          </div>
        </div>
      )}

      {/* Feed Display */}
      {activeFid && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {userInfo ? `${userInfo.display_name}'s For You Feed` : `FID ${activeFid} - For You Feed`}
            </h3>
            <div className="flex items-center gap-2">
              <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-sm font-medium">
                🔥 Live via x402
              </span>
            </div>
          </div>
          
          <X402FeedList
            fid={activeFid}
            limit={20}
          />
        </div>
      )}
    </div>
  );
}
