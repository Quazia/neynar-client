import x402Client from '../x402Client';
import { NeynarFeed, FeedParams } from './types';

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

      console.log('🔥 Making x402 request to For You feed with params:', params);

      // This will trigger x402 flow: GET → 402 → sign → retry → 200
      // Hitting the correct For You feed endpoint
      const client = await x402Client();
      const response = await client.get(`/farcaster/feed/for_you`, {
        params,
      });

      console.log('✅ For You feed response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch For You feed:', error);
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

  /**
   * Generic feed method
   */
  static async getFeed(params: FeedParams): Promise<NeynarFeed> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.cursor) queryParams.append('cursor', params.cursor);
      if (params.fid) queryParams.append('fid', params.fid.toString());
      if (params.fids) queryParams.append('fids', params.fids);
      if (params.channel_id) queryParams.append('channel_id', params.channel_id);
      if (params.filter_type) queryParams.append('filter_type', params.filter_type);
      if (params.with_recasts !== undefined) queryParams.append('with_recasts', params.with_recasts.toString());
      if (params.viewer_fid) queryParams.append('viewer_fid', params.viewer_fid.toString());

      const response = await x402Client().get(`/farcaster/feed`, {
        params: Object.fromEntries(queryParams),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      throw error;
    }
  }
}

export default FeedService;
