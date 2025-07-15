import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';

// Import the candid interface for onchain360_backend
import { idlFactory } from '../declarations/onchain360_backend';
import { canisterId as backendCanisterId } from '../declarations/onchain360_backend';

// Configuration options for different environments
const LOCAL_REPLICA_URLS = [
  'http://127.0.0.1:4943',  // Default local
  'http://localhost:4943',  // Alternative local
  'http://127.0.0.1:8000',  // Legacy
  'http://localhost:8000',  // Legacy alternative
];

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

// Dynamically determine environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use environment-specific canister ID
// For local development: first try from environment variables, then localStorage, then fallbacks
const DEFAULT_LOCAL_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
const PROD_CANISTER_ID = 'vizcg-th777-77774-qaaea-cai';

// Get from .env if available
const envCanisterId = import.meta.env?.VITE_CANISTER_ID || process.env?.VITE_CANISTER_ID;

// Determine the canister ID to use
const CANISTER_ID = isLocal 
  ? envCanisterId || backendCanisterId || localStorage.getItem('localCanisterId') || DEFAULT_LOCAL_CANISTER_ID
  : PROD_CANISTER_ID;

// Log canister ID for debugging
console.log('Using backend canister ID:', CANISTER_ID);

// Function to handle window.location.reload safely
const safeReload = () => {
  try {
    setTimeout(() => window.location.reload(), 500);
  } catch (e) {
    console.error('Failed to reload:', e);
  }
};

// Types
export interface ActorService {
  // User management
  create_user: (request: {
    username: string;
    bio: string;
    profile_picture?: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  
  get_user: (principal: Principal) => Promise<any>;
  get_current_user: () => Promise<any>;
  update_user: (request: {
    username: string;
    bio: string;
    profile_picture?: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  
  get_caller: () => Promise<Principal>;
  
  // Post management
  create_post: (_request: {
    content: string;
    image_url?: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  
  get_posts: () => Promise<any[]>;
  get_all_posts: () => Promise<any[]>;
  get_user_posts: (_principal: Principal) => Promise<any[]>;
  like_post: (_postId: string) => Promise<{ Ok?: any; Err?: string }>;
  delete_post: (_postId: string) => Promise<{ Ok?: any; Err?: string }>;
  
  // Comment management
  create_comment: (_request: {
    post_id: string;
    content: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  
  get_comments: (_postId: string) => Promise<any[]>;
  
  // Governance management
  create_proposal: (_request: {
    title: string;
    description: string;
    proposal_type: string;
    target_post_id?: string;
    target_user_id?: string;
    voting_duration_hours: number;
  }) => Promise<{ Ok?: any; Err?: string }>;
  
  get_proposals: () => Promise<any[]>;
  get_proposal: (_proposalId: string) => Promise<any>;
  vote_on_proposal: (_request: {
    proposal_id: string;
    vote_type: string;
  }) => Promise<{ Ok?: any; Err?: string }>;
  
  get_votes: (_proposalId: string) => Promise<any[]>;
  get_user_vote: (_proposalId: string, _userId: string) => Promise<any>;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to try multiple replica URLs
const tryMultipleReplicas = async (fn: (url: string) => Promise<any>): Promise<{ success: boolean, result?: any, url?: string }> => {
  for (const url of LOCAL_REPLICA_URLS) {
    try {
      // Store function result and return it with the URL
      return { success: true, result: await fn(url), url };
    } catch (e) {
      console.warn(`Failed with replica URL ${url}:`, e);
      // Continue to next URL
    }
  }
  return { success: false };
};

class ActorManager {
  private actor: ActorService | null = null;
  private agent: HttpAgent | null = null;
  private workingUrl: string | null = null;

  async createActor(identity?: any, retryCount = 0): Promise<ActorService> {
    try {
      console.log(`Creating actor (attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`);
      
      // Use Plug agent if available and no identity is provided
      if (!identity && window.ic?.plug?.agent) {
        console.log('Using Plug agent for actor creation');
        this.agent = window.ic.plug.agent;
      } else {
        // If we're in a local environment, try multiple replica URLs
        if (isLocal) {
          if (this.workingUrl) {
            // Use previously successful URL if we have one
            console.log(`Using previously successful URL: ${this.workingUrl}`);
            this.agent = new HttpAgent({
              host: this.workingUrl,
              identity,
            });
          } else {
            // Try multiple URLs
            console.log('Trying multiple replica URLs...');
            const result = await tryMultipleReplicas(async (url) => {
              console.log(`Trying replica URL: ${url}`);
              const tempAgent = new HttpAgent({
                host: url,
                identity,
              });
              
              await tempAgent.fetchRootKey();
              return tempAgent;
            });
            
            if (result.success && result.result) {
              this.agent = result.result;
              this.workingUrl = result.url as string;
              console.log(`Successfully connected to replica at ${this.workingUrl}`);
            } else {
              console.error('Failed to connect to any replica URL');
              throw new Error('Failed to connect to any replica URL');
            }
          }
        } else {
          // Production environment
          console.log('Creating new HttpAgent for production');
          this.agent = new HttpAgent({
            host: 'https://ic0.app',
            identity,
          });
        }
      }

      if (!CANISTER_ID) {
        console.error('Canister ID not found. Check environment variables or declarations.');
        throw new Error('Missing backend canister ID');
      }

      console.log('Creating actor with canister ID:', CANISTER_ID);
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: CANISTER_ID,
      }) as ActorService;
      
      // Verify actor is working by testing a simple call
      if (this.actor) {
        try {
          console.log('Testing backend connectivity...');
          const principal = await this.actor.get_caller();
          console.log('Actor initialized successfully. Principal:', principal.toString());
          
          // If we're in local mode, store the working canister ID
          if (isLocal) {
            localStorage.setItem('localCanisterId', CANISTER_ID);
          }
        } catch (error) {
          console.error('Actor test call failed:', error);
          
          // Try again if we haven't exceeded max retries
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY}ms...`);
            await delay(RETRY_DELAY);
            return this.createActor(identity, retryCount + 1);
          }
          
          throw new Error('Backend canister not responding. Please ensure it is deployed and running. Try running dfx-start.bat and dfx-status.bat.');
        }
      }
      
    } catch (error) {
      console.error('Failed to create actor:', error);
      
      // Try again if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return this.createActor(identity, retryCount + 1);
      }
      
      throw new Error(`Failed to initialize backend connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (!this.actor) {
      if (retryCount < MAX_RETRIES) {
        console.log(`No actor created, retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return this.createActor(identity, retryCount + 1);
      }
      throw new Error('Actor creation failed');
    }

    return this.actor;
  }

  getActor(): ActorService | null {
    return this.actor;
  }
}

const actorManager = new ActorManager();

// Create an authenticated actor using Plug Wallet
export const getAuthenticatedActor = async (): Promise<ActorService> => {
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
      throw new Error('Backend canister not responding to authenticated calls. Please ensure dfx is running by using dfx-start.bat.');
    }
    
    return plugActor as ActorService;
  } catch (error) {
    console.error('Failed to create authenticated actor:', error);
    throw new Error(`Failed to create authenticated backend connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create an anonymous actor (for read-only operations)
export const getAnonymousActor = async (): Promise<ActorService> => {
  return await actorManager.createActor();
};

// Helper function to check backend status
export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    const actor = await actorManager.createActor();
    await actor.get_caller();
    return true;
  } catch (error) {
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