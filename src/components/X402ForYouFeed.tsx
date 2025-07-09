"use client";

import { useEffect, useState } from 'react';
import { NeynarCast } from '@/lib/api';

interface X402FeedListProps {
  fid: number;  // Required for For You feed
  viewerFid?: number;
  limit?: number;
}

export function X402FeedList({ 
  fid, 
  viewerFid, 
  limit = 25
}: X402FeedListProps) {
  const [casts, setCasts] = useState<NeynarCast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🚀 Fetching For You feed for FID:', fid);

        // Call our API route that will use x402
        const response = await fetch(`/api/feed/for-you?fid=${fid}&limit=${limit}${viewerFid ? `&viewer_fid=${viewerFid}` : ''}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCasts(data.casts || []);
        console.log('✅ For You feed loaded:', data.casts?.length, 'casts');
      } catch (err) {
        console.error('❌ Failed to fetch For You feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch feed');
      } finally {
        setLoading(false);
      }
    };

    if (fid) {
      fetchFeed();
    }
  }, [fid, viewerFid, limit]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-white">🔄 Loading For You feed...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-red-500">❌ Error: {error}</div>
      </div>
    );
  }

  if (!casts.length) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-gray-400">📭 No casts found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">🎯 For You Feed (x402 powered)</h2>
      {casts.map((cast) => (
        <div key={cast.hash} className="bg-gray-800 rounded-lg p-4 text-white border border-gray-700">
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
          
          <div className="mb-3 whitespace-pre-wrap">
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
