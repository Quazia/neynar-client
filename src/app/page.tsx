"use client";

import { NeynarChannel } from "@/lib/api/types";
import { useNeynarContext } from "@neynar/react";
import { X402FeedList } from "@/components/X402ForYouFeed";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useNeynarContext();
  const [channels, setChannels] = useState<any | null>();

  const fetchChannels = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/channels?fid=abc${user?.fid}`);
    const data = await response.json();
    setChannels(data);
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user]);

  return (
    <main className="flex min-h-screen p-16">
      {user && (
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Channels</h1>
          <div className="flex flex-col">
            {channels &&
              channels.channels.map((channel: NeynarChannel) => (
                <div key={channel.url} className="rounded-lg p-4">
                  <Link href={`/channel/${channel.id}`}>{channel.name}</Link>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="ml-40 flex flex-col gap-6">
        <X402FeedList
          fid={user?.fid || 14206}  // Default to FID 14206 if not logged in
          limit={25}
        />
        {!user && (
          <div className="text-white text-center p-4 mb-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              📺 Showing feed for FID 14206 • Sign in for your personalized For You feed
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
