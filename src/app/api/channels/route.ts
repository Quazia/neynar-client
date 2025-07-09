import { ChannelService } from "@/lib/api";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return NextResponse.json(
        { error: "FID parameter is required" },
        { status: 400 }
      );
    }

    const channels = await ChannelService.fetchUserChannels(Number(fid));

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).response?.data?.message || "Failed to fetch channels" },
      { status: (error as any).response?.status || 500 }
    );
  }
};
