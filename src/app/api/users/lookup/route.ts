import { UserService } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }

    console.log(`🔍 API: Looking up user by username: ${username}`);
    const userResponse = await UserService.lookupUserByUsername(username);
    console.log(`✅ API: User lookup successful for ${username}`);

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
