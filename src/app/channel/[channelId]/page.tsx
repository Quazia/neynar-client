import { X402FeedList } from "@/components/X402Feed";

export default async function Page({
  params: { channelId },
}: {
  params: { channelId: string };
}) {
  return (
    <main className="mt-4 flex min-h-screen w-full flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">{channelId}</h1>
      <X402FeedList
        feedType="channel"
        channelId={channelId}
        viewerFid={2}
        limit={50}
      />
    </main>
  );
}
