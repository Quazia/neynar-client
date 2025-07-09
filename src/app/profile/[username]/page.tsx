import { NeynarProfileCard } from "@/components/Neynar";
import { X402FeedList } from "@/components/X402Feed";
import { UserService } from "@/lib/api";

async function getData(username: string) {
  const user = await UserService.lookupUserByUsername(username);

  return { user: user.result.user };
}

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const { user } = await getData(username);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <NeynarProfileCard fid={user.fid} />
      <div className="mt-4 flex items-center">
        <X402FeedList
          feedType="following"
          fid={user.fid}
          limit={50}
        />
      </div>
    </main>
  );
}
