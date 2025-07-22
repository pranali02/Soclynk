import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { mockPosts, mockUsers } from '../utils/mockData';

// Import the candid interface for soclynk_backend
import { idlFactory } from '../declarations/soclynk_backend';

// Configuration
const LOCAL_HOST = 'http://127.0.0.1:4943';
const USE_MOCK_DATA = true; // Set to true to use mock data instead of backend

// Get canister ID from environment or use local development default
const getCanisterId = () => {
  // Try to get from Vite environment variables first
  if (import.meta && import.meta.env && import.meta.env.VITE_CANISTER_ID_SOCLYNK_BACKEND) {
    return import.meta.env.VITE_CANISTER_ID_SOCLYNK_BACKEND;
  }
  // For local development, return default local canister ID
  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    return import.meta.env.VITE_CANISTER_ID_SOCLYNK_BACKEND || 'rrkah-fqaaa-aaaaa-aaaaq-cai';
  }
  return 'rrkah-fqaaa-aaaaa-aaaaq-cai'; // Default local canister ID
};

const CANISTER_ID = getCanisterId();

console.log('Using backend canister ID:', CANISTER_ID);

// Types for better integration
export interface ActorService {
  get_caller: () => Promise<Principal>;
  create_user: (request: {
    username: string;
    bio: string;
    profile_picture?: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  get_current_user: () => Promise<any>;
  get_user: (principal: Principal) => Promise<any>;
  update_user: (request: {
    username: string;
    bio: string;
    profile_picture?: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  create_post: (request: {
    content: string;
    image_url?: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  get_posts: () => Promise<any[]>;
  get_user_posts: (principal: Principal) => Promise<any[]>;
  like_post: (postId: string) => Promise<{ Ok?: any; Err?: string }>;
  delete_post: (postId: string) => Promise<{ Ok?: any; Err?: string }>;
  create_comment: (request: {
    post_id: string;
    content: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  get_comments: (postId: string) => Promise<any[]>;
}

class ActorManager {
  private actor: ActorService | null = null;
  private agent: HttpAgent | null = null;
  private mockActor: ActorService | null = null;

  async createActor(identity?: any): Promise<ActorService> {
    // If we're using mock data, return the mock actor
    if (USE_MOCK_DATA) {
      if (!this.mockActor) {
        this.mockActor = this.createMockActor();
      }
      return this.mockActor;
    }

    try {
      console.log('Creating actor...');
      
      // Use Plug agent if available and no identity is provided
      if (!identity && window.ic?.plug?.agent) {
        console.log('Using Plug agent');
        this.agent = window.ic.plug.agent;
      } else {
        console.log('Creating new HttpAgent');
        this.agent = new HttpAgent({
          host: LOCAL_HOST,
          identity,
        });
        
        // Fetch root key for local development
        await this.agent.fetchRootKey();
      }

      console.log('Creating actor with canister ID:', CANISTER_ID);
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent ?? undefined,
        canisterId: CANISTER_ID,
      }) as ActorService;
      
      // Test the connection
      try {
        const principal = await this.actor.get_caller();
        console.log('Actor initialized successfully. Principal:', principal.toString());
      } catch (error) {
        console.warn('Actor test call failed:', error);
        // Don't throw here, let the actual method calls handle errors
      }
      
    } catch (error) {
      console.error('Failed to create actor:', error);
      throw new Error(`Failed to initialize backend connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (!this.actor) {
      throw new Error('Actor creation failed');
    }

    return this.actor;
  }

  private createMockActor(): ActorService {
    console.log('Creating mock actor for development');
    
    // Generate a random principal ID for the current user
    const mockPrincipal = Principal.fromText('2vxsx-fae');
    
    return {
      get_caller: async () => {
        return mockPrincipal;
      },
      
      create_user: async (request) => {
        console.log('Mock create_user called with:', request);
        const user = {
          id: mockPrincipal,
          username: request.username,
          bio: request.bio,
          profile_picture: request.profile_picture,
          created_at: BigInt(Date.now() * 1000000),
          followers_count: BigInt(0),
          following_count: BigInt(0),
          posts_count: BigInt(0),
        };
        return { Ok: user };
      },
      
      get_current_user: async () => {
        return mockUsers[0];
      },
      
      get_user: async () => {
        return mockUsers[0];
      },
      
      update_user: async (request) => {
        console.log('Mock update_user called with:', request);
        const user = {
          id: mockPrincipal,
          username: request.username,
          bio: request.bio,
          profile_picture: request.profile_picture,
          created_at: BigInt(Date.now() * 1000000),
          followers_count: BigInt(0),
          following_count: BigInt(0),
          posts_count: BigInt(0),
        };
        return { Ok: user };
      },
      
      create_post: async (request) => {
        console.log('Mock create_post called with:', request);
        const post = {
          id: `post_${Date.now()}`,
          author: mockPrincipal,
          content: request.content,
          image_url: request.image_url,
          created_at: BigInt(Date.now() * 1000000),
          likes_count: BigInt(0),
          comments_count: BigInt(0),
          liked_by: [],
        };
        return { Ok: post };
      },
      
      get_posts: async () => {
        return mockPosts;
      },
      
      get_user_posts: async () => {
        return mockPosts.filter(post => post.author === mockUsers[0].id);
      },
      
      like_post: async (postId) => {
        console.log('Mock like_post called for post:', postId);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
          post.likes_count = post.likes_count + BigInt(1);
          post.liked_by.push(mockPrincipal);
          return { Ok: post };
        }
        return { Err: 'Post not found' };
      },
      
      delete_post: async (postId) => {
        console.log('Mock delete_post called for post:', postId);
        return { Ok: null };
      },
      
      create_comment: async (request) => {
        console.log('Mock create_comment called with:', request);
        const comment = {
          id: `comment_${Date.now()}`,
          post_id: request.post_id,
          author: mockPrincipal,
          content: request.content,
          created_at: BigInt(Date.now() * 1000000),
        };
        return { Ok: comment };
      },
      
      get_comments: async (postId) => {
        console.log('Mock get_comments called for post:', postId);
        return [
          {
            id: 'comment_1',
            post_id: postId,
            author: mockPrincipal,
            content: 'This is a mock comment',
            created_at: BigInt(Date.now() * 1000000),
          }
        ];
      },
    };
  }

  getActor(): ActorService | null {
    if (USE_MOCK_DATA) {
      if (!this.mockActor) {
        this.mockActor = this.createMockActor();
      }
      return this.mockActor;
    }
    return this.actor;
  }
}

const actorManager = new ActorManager();

// Create an authenticated actor using Plug Wallet
export const getAuthenticatedActor = async (): Promise<ActorService> => {
  // If we're using mock data, return the mock actor
  if (USE_MOCK_DATA) {
    return actorManager.getActor() || await actorManager.createActor();
  }

  // Check if Plug is available and connected
  if (!window.ic?.plug) {
    throw new Error('Plug Wallet not available');
  }
  
  const isConnected = await window.ic.plug.isConnected();
  if (!isConnected) {
    throw new Error('Plug Wallet not connected');
  }
  
  if (!window.ic.plug.agent) {
    throw new Error('Plug agent not available');
  }
  
  // Use Plug's built-in actor creation for authenticated calls
  try {
    console.log('Creating authenticated Plug actor for canister ID:', CANISTER_ID);
    const plugActor = await window.ic.plug.createActor({
      canisterId: CANISTER_ID,
      interfaceFactory: idlFactory,
    });
    
    if (!plugActor) {
      throw new Error('Failed to create Plug actor');
    }
    
    // Test the connection
    try {
      await plugActor.get_caller();
      console.log('Authenticated actor created successfully with Plug');
    } catch (callError) {
      console.error('Backend connectivity test failed:', callError);
      throw new Error('Backend canister not responding. Please ensure dfx is running.');
    }
    
    return plugActor as ActorService;
  } catch (error) {
    console.error('Failed to create authenticated actor:', error);
    throw new Error(`Failed to create authenticated backend connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create an anonymous actor (for read-only operations)
export const getAnonymousActor = async (): Promise<ActorService> => {
  // If we're using mock data, return the mock actor
  if (USE_MOCK_DATA) {
    return actorManager.getActor() || await actorManager.createActor();
  }
  return await actorManager.createActor();
};

// Helper function to check backend status
export const checkBackendStatus = async (): Promise<boolean> => {
  // If we're using mock data, always return true
  if (USE_MOCK_DATA) {
    return true;
  }
  try {
    const actor = await actorManager.createActor();
    await actor.get_caller();
    return true;
  } catch (error) {
    console.error('Backend status check failed:', error);
    return false;
  }
};

// Data mapping utilities
export const mapBackendPostToFrontend = (backendPost: any) => {
  return {
    id: backendPost.id,
    author: backendPost.author.toString(),
    author_username: backendPost.author_username,
    content: backendPost.content,
    image_url: backendPost.image_url?.[0] || undefined,
    created_at: Number(backendPost.created_at),
    likes_count: Number(backendPost.likes_count),
    comments_count: Number(backendPost.comments_count),
    liked_by: backendPost.liked_by.map((p: any) => p.toString()),
  };
}; 