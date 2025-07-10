"use client";

import { useState } from 'react';
import { NeynarUser } from '@/lib/api/types';
import Link from 'next/link';
import { UserChannels } from './UserChannels';

export function UserLookup() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setUser(null);
      
      console.log(`🔍 Looking up user: ${username}`);
      const response = await fetch(`/api/users/lookup?username=${encodeURIComponent(username.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data.result.user);
      console.log(`✅ User lookup successful via x402:`, data.result.user);
    } catch (err) {
      console.error('Failed to lookup user:', err);
      setError(err instanceof Error ? err.message : 'Failed to lookup user');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUsername('');
    setUser(null);
    setError(null);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-xl">🔍</span>
        User Discovery via x402
      </h3>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (e.g., dwr, vitalik.eth)"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">🔍</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '�'
            )}
            {loading ? 'Searching...' : 'Lookup'}
          </button>
          {(user || error) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Clear results"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Quick lookup buttons */}
        {!user && !loading && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">✨ Try these popular users:</p>
            <div className="flex flex-wrap gap-2">
              {['dwr', 'vitalik.eth', 'jessepollak', 'sethfork', 'cdixon.eth'].map((suggestedUser) => (
                <button
                  key={suggestedUser}
                  onClick={() => setUsername(suggestedUser)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full text-xs transition-colors border border-gray-600 hover:border-gray-500"
                >
                  {suggestedUser}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-lg p-4 border border-red-700 mb-6">
          <h4 className="text-red-100 font-medium mb-1 flex items-center gap-2">
            ❌ Lookup Failed
          </h4>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {user && (
        <div className="bg-gradient-to-br from-gray-700 to-gray-750 rounded-xl p-6 border border-gray-600 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={user.pfp_url}
                alt={user.display_name}
                className="w-20 h-20 rounded-xl object-cover border-3 border-gray-500 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/80/80';
                }}
              />
              {user.verifications && user.verifications.length > 0 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-2 border-gray-700 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-bold text-white truncate">
                  {user.display_name}
                </h4>
                {user.verifications && user.verifications.length > 0 && (
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              <p className="text-blue-300 mb-3 font-medium">@{user.username}</p>
              
              {user.profile?.bio?.text && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {user.profile.bio.text}
                </p>
              )}
              
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-lg font-bold text-white">
                    {user.follower_count?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-lg font-bold text-white">
                    {user.following_count?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-400">Following</div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-400">
                    {user.fid}
                  </div>
                  <div className="text-xs text-gray-400">FID</div>
                </div>
              </div>
              
              {user.verifications && user.verifications.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">✅ Verified addresses:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.verifications.slice(0, 2).map((address, index) => (
                      <span
                        key={index}
                        className="bg-gray-600 text-gray-200 px-3 py-1 rounded-lg text-xs font-mono border border-gray-500"
                      >
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </span>
                    ))}
                    {user.verifications.length > 2 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{user.verifications.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Link
                  href={`/profile/${user.username}`}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all text-center"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => setUsername(user.username)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  🔄
                </button>
              </div>
              
              {/* Show user's channels */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <UserChannels 
                  fid={user.fid}
                  title={`${user.display_name}'s Channels`}
                  showStats={true}
                  maxChannels={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span className="text-blue-400">💳</span>
          User lookup powered by x402 on Base Network
        </p>
      </div>
    </div>
  );
}
