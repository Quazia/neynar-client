import x402Client from '../x402Client';
import { NeynarFeed } from './types';

export class FeedService {
  /**
   * Get For You feed for a specific user (personalized feed)
   * This matches the /v2/farcaster/feed/for_you endpoint from Neynar API
   */
  static async getForYouFeed(fid: number, limit = 25, cursor?: string, viewerFid?: number): Promise<NeynarFeed> {
    try {
      const params: any = { 
        fid, 
        limit,
        provider: 'neynar'
      };
      if (cursor) params.cursor = cursor;
      if (viewerFid) params.viewer_fid = viewerFid;

      console.log('\n� === FEED SERVICE: FOR YOU FEED ===');
      console.log('🎯 Initiating For You feed request:');
      console.log(`  👤 FID: ${fid}`);
      console.log(`  📊 Limit: ${limit}`);
      console.log(`  🔍 Cursor: ${cursor || 'None (first page)'}`);
      console.log(`  👁️ Viewer FID: ${viewerFid || 'None'}`);
      console.log(`  🌐 Endpoint: /farcaster/feed/for_you`);
      console.log(`  💳 Payment: x402 micropayment will be required`);
      console.log(`  ⏰ Request Time: ${new Date().toISOString()}`);
      console.log('═══════════════════════════════\n');

      // This will trigger x402 flow: GET → 402 → sign → retry → 200
      // Hitting the correct For You feed endpoint
      const client = await x402Client();
      const response = await client.get(`/farcaster/feed/for_you`, {
        params,
      });

      console.log('\n🎉 === FEED SERVICE: SUCCESS ===');
      console.log('✅ For You feed retrieved successfully:');
      console.log(`  📊 Casts returned: ${response.data.casts?.length || 0}`);
      console.log(`  🔄 Next cursor: ${response.data.next?.cursor || 'None'}`);
      console.log(`  📏 Response size: ${JSON.stringify(response.data).length} characters`);
      console.log(`  ⏰ Completion Time: ${new Date().toISOString()}`);
      console.log('═══════════════════════════════\n');
      
      return response.data;
    } catch (error) {
      console.log('\n❌ === FEED SERVICE: ERROR ===');
      console.error('💥 Failed to fetch For You feed:');
      console.error(`  👤 FID: ${fid}`);
      console.error(`  📊 Limit: ${limit}`);
      console.error(`  🔍 Cursor: ${cursor || 'None'}`);
      console.error(`  🔴 Error: ${error}`);
      console.error(`  ⏰ Error Time: ${new Date().toISOString()}`);
      console.log('═══════════════════════════════\n');
      throw error;
    }
  }

  /**
   * Get trending feed - using for_you without fid for trending
   */
  static async getTrendingFeed(limit = 25, cursor?: string): Promise<NeynarFeed> {
    try {
      const params: any = {
        limit: limit,
        provider: 'neynar'
      };
      
      if (cursor) params.cursor = cursor;

      // For trending, we might need to use a different endpoint
      // For now, trying for_you without specific fid
      const response = await x402Client().get(`/farcaster/feed/for_you`, {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch trending feed:', error);
      throw error;
    }
  }

  /**
   * Get channel feed - this might need a different endpoint
   */
  static async getChannelFeed(channelId: string, limit = 25, cursor?: string, viewerFid?: number): Promise<NeynarFeed> {
    try {
      const params: any = {
        channel_id: channelId,
        limit: limit,
      };
      
      if (cursor) params.cursor = cursor;
      if (viewerFid) params.viewer_fid = viewerFid;

      // Channel feed might use a different endpoint - need to check Neynar docs
      const response = await x402Client().get(`/farcaster/feed`, {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch channel feed:', error);
      throw error;
    }
  }
}

export default FeedService;
