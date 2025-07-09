import { FeedService } from "@/lib/api";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");
    const viewer_fid = searchParams.get("viewer_fid");

    if (!fid) {
      return NextResponse.json(
        { error: "FID parameter is required for For You feed" },
        { status: 400 }
      );
    }

    console.log('📡 API: Fetching For You feed for FID:', fid);

    const feed = await FeedService.getForYouFeed(
      Number(fid),
      limit ? Number(limit) : 25,
      cursor || undefined,
      viewer_fid ? Number(viewer_fid) : undefined
    );

    console.log('✅ API: For You feed fetched successfully');
    return NextResponse.json(feed, { status: 200 });
  } catch (error: any) {
    console.error('❌ API: Failed to fetch For You feed:', error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch For You feed" },
      { status: error.response?.status || 500 }
    );
  }
};
