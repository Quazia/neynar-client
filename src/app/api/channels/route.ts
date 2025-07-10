import { ChannelService } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const fidParam = request.nextUrl.searchParams.get("fid");

    if (!fidParam) {
      return NextResponse.json(
        { error: "FID parameter is required" },
        { status: 400 }
      );
    }

    // Remove 'abc' prefix if it exists (from old implementation)
    const cleanFid = fidParam.startsWith('abc') ? fidParam.slice(3) : fidParam;
    const fid = Number(cleanFid);

    if (isNaN(fid)) {
      return NextResponse.json(
        { error: "Invalid FID parameter" },
        { status: 400 }
      );
    }

    console.log(`📺 API: Fetching channels for FID: ${fid}`);
    const channels = await ChannelService.fetchUserChannels(fid);
    console.log(`✅ API: Successfully fetched ${channels.channels?.length || 0} channels`);

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error('❌ API: Failed to fetch channels:', error);
    return NextResponse.json(
      { error: (error as any).response?.data?.message || "Failed to fetch channels" },
      { status: (error as any).response?.status || 500 }
    );
  }
};
