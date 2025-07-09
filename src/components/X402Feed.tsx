"use client";

import { useEffect, useState } from 'react';
import { NeynarCast } from '@/lib/api';

interface X402FeedListProps {
  feedType: 'following' | 'trending' | 'channel';
  fid?: number;
  channelId?: string;
  viewerFid?: number;
  limit?: number;
  withRecasts?: boolean;
}

export function X402FeedList({ 
  feedType, 
  fid, 
  channelId, 
  viewerFid, 
  limit = 25,
  withRecasts = true 
}: X402FeedListProps) {
  const [casts, setCasts] = useState<NeynarCast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          feedType,
          limit: limit.toString(),
        });

        if (fid) params.append('fid', fid.toString());
        if (channelId) params.append('channelId', channelId);
        if (viewerFid) params.append('viewerFid', viewerFid.toString());

        const response = await fetch(`/api/feed?${params}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch feed');
        }

        const feed = await response.json();
        setCasts(feed.casts || []);
      } catch (err) {
        console.error('Failed to fetch feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch feed');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [feedType, fid, channelId, viewerFid, limit]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-white">Loading feed with x402...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-green-400 text-sm">✅ Feed loaded via x402 payments</div>
      {casts.map((cast) => (
        <div key={cast.hash} className="bg-gray-800 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <img 
              src={cast.author.pfp_url} 
              alt={cast.author.display_name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-semibold">{cast.author.display_name}</div>
              <div className="text-gray-400 text-sm">@{cast.author.username}</div>
            </div>
          </div>
          
          <div className="mb-3">
            {cast.text}
          </div>
          
          <div className="flex space-x-4 text-sm text-gray-400">
            <span>💜 {cast.reactions.likes_count}</span>
            <span>🔄 {cast.reactions.recasts_count}</span>
            <span>💬 {cast.replies.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
