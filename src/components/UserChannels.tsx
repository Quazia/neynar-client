"use client";

import { useEffect, useState } from 'react';
import { NeynarChannel } from '@/lib/api/types';
import Link from 'next/link';

interface UserChannelsProps {
  fid: number;
  title?: string;
  showStats?: boolean;
  maxChannels?: number;
}

export function UserChannels({ 
  fid, 
  title = "User Channels", 
  showStats = true,
  maxChannels 
}: UserChannelsProps) {
  const [channels, setChannels] = useState<NeynarChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔥 Fetching channels for FID: ${fid}`);
        const response = await fetch(`/api/channels?fid=${fid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const channelList = data.channels || [];
        
        // Limit channels if specified
        const displayChannels = maxChannels 
          ? channelList.slice(0, maxChannels)
          : channelList;
          
        setChannels(displayChannels);
        console.log(`✅ Loaded ${displayChannels.length} channels via x402`);
      } catch (err) {
        console.error('Failed to fetch user channels:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch channels');
      } finally {
        setLoading(false);
      }
    };

    if (fid) {
      fetchChannels();
    }
  }, [fid, maxChannels]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold text-white">Loading {title}...</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-xl p-6 border border-red-700 shadow-lg">
        <h3 className="text-lg font-semibold text-red-100 mb-3 flex items-center gap-2">
          ❌ Error Loading Channels
        </h3>
        <p className="text-red-200 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-xl">📺</span>
          {title}
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📺</div>
          <p className="text-gray-400 text-sm">No channels found for this user.</p>
          <p className="text-gray-500 text-xs mt-1">They might not have joined any channels yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-xl">📺</span>
          {title}
        </h3>
        {showStats && (
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {channels.length} channel{channels.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {channels.map((channel, index) => (
          <Link
            key={channel.id}
            href={`/channel/${channel.id}`}
            className="block bg-gradient-to-r from-gray-700 via-gray-700 to-gray-700 hover:from-gray-600 hover:via-gray-600 hover:to-gray-600 rounded-lg p-4 transition-all duration-200 group border border-gray-600 hover:border-gray-500"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                {channel.image_url ? (
                  <img
                    src={channel.image_url}
                    alt={channel.name}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-gray-500 group-hover:border-blue-400 transition-colors"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-500 group-hover:border-blue-400 transition-colors">
                    <span className="text-white font-bold text-lg">
                      {channel.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-700 opacity-80">
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                    /{channel.id}
                  </h4>
                  <span className="text-gray-400 text-sm font-medium">
                    {channel.name}
                  </span>
                </div>
                
                {channel.description && (
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {channel.description}
                  </p>
                )}
                
                {showStats && (
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <span className="text-blue-400">👥</span>
                      {channel.follower_count?.toLocaleString() || '0'} followers
                    </span>
                    {channel.url && (
                      <span className="flex items-center gap-1 text-gray-500 truncate">
                        <span className="text-green-400">🔗</span>
                        <span className="max-w-20 truncate">{channel.url}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-gray-400 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {maxChannels && channels.length === maxChannels && (
        <div className="mt-6 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
            View all channels →
          </button>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span className="text-blue-400">💳</span>
          Powered by x402 on Base Network
        </p>
      </div>
    </div>
  );
}
