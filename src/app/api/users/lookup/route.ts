import { UserService } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username');
    const fidParam = request.nextUrl.searchParams.get('fid');
    
    // Must have either username or fid
    if (!username && !fidParam) {
      return NextResponse.json({ error: 'Username or FID parameter is required' }, { status: 400 });
    }

    let userResponse;
    
    if (fidParam) {
      const fid = parseInt(fidParam);
      if (isNaN(fid) || fid <= 0) {
        return NextResponse.json({ error: 'FID must be a valid positive number' }, { status: 400 });
      }
      
      console.log(`🔍 API: Looking up user by FID: ${fid}`);
      userResponse = await UserService.getUserByFid(fid);
      console.log(`✅ API: User lookup successful for FID ${fid}`);
    } else {
      console.log(`🔍 API: Looking up user by username: ${username}`);
      userResponse = await UserService.lookupUserByUsername(username!);
      console.log(`✅ API: User lookup successful for ${username}`);
    }

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('❌ API: Failed to lookup user:', error);
    return NextResponse.json(
      { 
        error: (error as any).response?.data?.message || 
               (error as any).message || 
               'Failed to lookup user' 
      },
      { status: (error as any).response?.status || 500 }
    );
  }
}
