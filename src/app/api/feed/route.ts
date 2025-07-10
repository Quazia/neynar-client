import { FeedService } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const feedType = request.nextUrl.searchParams.get("feedType");
    const fid = request.nextUrl.searchParams.get("fid");
    const channelId = request.nextUrl.searchParams.get("channelId");
    const viewerFid = request.nextUrl.searchParams.get("viewerFid");
    const limit = request.nextUrl.searchParams.get("limit");

    let feed;
    switch (feedType) {
      case 'following':
        if (!fid) {
          return NextResponse.json(
            { error: "FID is required for following feed" },
            { status: 400 }
          );
        }
        // Use For You feed for following (they're essentially the same - personalized feed)
        feed = await FeedService.getForYouFeed(
          Number(fid), 
          limit ? Number(limit) : 25
        );
        break;
        
      case 'trending':
        feed = await FeedService.getTrendingFeed(
          limit ? Number(limit) : 25
        );
        break;
        
      case 'channel':
        if (!channelId) {
          return NextResponse.json(
            { error: "Channel ID is required for channel feed" },
            { status: 400 }
          );
        }
        feed = await FeedService.getChannelFeed(
          channelId,
          limit ? Number(limit) : 25,
          undefined,
          viewerFid ? Number(viewerFid) : undefined
        );
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid feed type" },
          { status: 400 }
        );
    }

    return NextResponse.json(feed, { status: 200 });
  } catch (error) {
    console.error('Feed API error:', error);
    return NextResponse.json(
      { error: (error as any).response?.data?.message || "Failed to fetch feed" },
      { status: (error as any).response?.status || 500 }
    );
  }
};
