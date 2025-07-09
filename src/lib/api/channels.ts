import x402Client from '../x402Client';
import { NeynarChannelsResponse, UserChannelsParams } from './types';

export class ChannelService {
  /**
   * Fetch user channels
   */
  static async fetchUserChannels(fid: number): Promise<NeynarChannelsResponse> {
    try {
      // This will trigger x402 flow: GET → 402 → sign → retry → 200
      const response = await x402Client().get(`/farcaster/user/channels`, {
        params: { fid },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch user channels:', error);
      throw error;
    }
  }
}

export default ChannelService;
