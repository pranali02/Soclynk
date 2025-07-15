export interface User {
  id: string;
  username: string;
  bio: string;
  profile_picture?: string;
  created_at: bigint;
  followers_count: bigint;
  following_count: bigint;
  posts_count: bigint;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  image_url?: string;
  created_at: bigint;
  likes_count: bigint;
  comments_count: bigint;
  liked_by: string[];
  // Repost fields
  is_repost?: boolean;
  original_post_id?: string;
  repost_comment?: string;
}

export interface PostWithAuthor {
  id: string;
  author: string;
  author_username: string;
  content: string;
  image_url?: string;
  created_at: bigint;
  likes_count: bigint;
  comments_count: bigint;
  liked_by: string[];
  // Repost fields
  is_repost?: boolean;
  original_post_id?: string;
  original_author?: string;
  original_author_username?: string;
  repost_comment?: string;
  repost_count?: bigint;
  reposted_by?: string[];
}

export interface PostComment {
  id: string;
  post_id: string;
  author: string;
  content: string;
  created_at: bigint;
}

export interface CreateUserRequest {
  username: string;
  bio: string;
  profile_picture?: string;
}

export interface CreatePostRequest {
  content: string;
  image_url?: string;
}

export interface CreateCommentRequest {
  post_id: string;
  content: string;
}

export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  principal: string | null;
  backendError: string | null;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Governance types
export interface Proposal {
  id: string;
  proposer: string;
  proposer_username: string;
  title: string;
  description: string;
  proposal_type: 'moderate_post' | 'change_rule' | 'ban_user' | 'other';
  target_post_id?: string;
  target_user_id?: string;
  created_at: bigint;
  voting_deadline: bigint;
  status: 'active' | 'approved' | 'rejected' | 'expired';
  votes_for: bigint;
  votes_against: bigint;
  total_votes: bigint;
  voters: string[];
}

export interface Vote {
  id: string;
  proposal_id: string;
  voter: string;
  voter_username: string;
  vote_type: 'approve' | 'reject';
  created_at: bigint;
  stake_weight?: bigint;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  proposal_type: 'moderate_post' | 'change_rule' | 'ban_user' | 'other';
  target_post_id?: string;
  target_user_id?: string;
  voting_duration_hours: number;
}

export interface CreateVoteRequest {
  proposal_id: string;
  vote_type: 'approve' | 'reject';
} 