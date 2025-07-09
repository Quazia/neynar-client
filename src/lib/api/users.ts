import x402Client from '../x402Client';
import { NeynarUser, NeynarUserResponse, UserLookupParams } from './types';

export class UserService {
  /**
   * Look up user by username
   */
  static async lookupUserByUsername(username: string): Promise<NeynarUserResponse> {
    try {
      // This will trigger x402 flow: GET → 402 → sign → retry → 200
      const response = await x402Client().get(`/farcaster/user/by_username`, {
        params: { username },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to lookup user by username:', error);
      throw error;
    }
  }

  /**
   * Get user by FID
   */
  static async getUserByFid(fid: number): Promise<NeynarUser> {
    try {
      const response = await x402Client().get(`/farcaster/user`, {
        params: { fid },
      });

      return response.data.user;
    } catch (error) {
      console.error('Failed to get user by FID:', error);
      throw error;
    }
  }
}

export default UserService;
