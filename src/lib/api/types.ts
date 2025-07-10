// Neynar API Types
export interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
}

export interface NeynarCast {
  hash: string;
  parent_hash?: string;
  parent_url?: string;
  root_parent_url?: string;
  parent_author?: NeynarUser;
  author: NeynarUser;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: Array<{ fid: number; fname: string }>;
    recasts: Array<{ fid: number; fname: string }>;
  };
  replies: {
    count: number;
  };
  mentioned_profiles: NeynarUser[];
}

export interface NeynarChannel {
  id: string;
  name: string;
  description: string;
  image_url: string;
  url: string;
  lead_fid: number;
  follower_count: number;
}

export interface NeynarFeed {
  casts: NeynarCast[];
  next?: {
    cursor?: string;
  };
}

export interface NeynarUserResponse {
  user: NeynarUser;
}

export interface NeynarChannelsResponse {
  channels: NeynarChannel[];
}

// API Request/Response types
export interface UserLookupParams {
  username: string;
}

export interface UserChannelsParams {
  fid: number;
}
