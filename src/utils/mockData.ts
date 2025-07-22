import { PostWithAuthor, User } from '../types';

// Simulate delay for realistic loading experience
export const simulateDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Generate realistic blockchain-style timestamps (recent dates)
const getRecentTimestamp = (daysAgo: number = 0, hoursAgo: number = 0): number => {
  const now = Date.now();
  const offset = (daysAgo * 24 * 60 * 60 * 1000) + (hoursAgo * 60 * 60 * 1000);
  return now - offset;
};

// Generate blockchain-style IDs
const generateBlockchainId = (prefix: string = ''): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}_${random}`;
};

// Mock users that look like real blockchain users
export const mockUsers: User[] = [
  {
    id: generateBlockchainId('user_'),
    username: 'crypto_pioneer',
    bio: 'Building the future of Web3 | DeFi enthusiast | Blockchain developer since 2017',
    profile_picture: undefined,
    created_at: BigInt(getRecentTimestamp(30)),
    followers_count: BigInt(1247),
    following_count: BigInt(342),
    posts_count: BigInt(89),
  },
  {
    id: generateBlockchainId('user_'),
    username: 'defi_analyst',
    bio: 'On-chain analytics | Yield farming strategies | Smart contract auditor',
    profile_picture: undefined,
    created_at: BigInt(getRecentTimestamp(45)),
    followers_count: BigInt(2103),
    following_count: BigInt(156),
    posts_count: BigInt(167),
  },
  {
    id: generateBlockchainId('user_'),
    username: 'nft_creator',
    bio: 'Digital artist creating unique NFT collections | Community builder',
    profile_picture: undefined,
    created_at: BigInt(getRecentTimestamp(15)),
    followers_count: BigInt(856),
    following_count: BigInt(423),
    posts_count: BigInt(234),
  },
];

// Realistic blockchain-focused posts
export const mockPosts: PostWithAuthor[] = [
  {
    id: generateBlockchainId('post_'),
    author: mockUsers[0].id,
    author_username: mockUsers[0].username,
    content: `Just deployed my first smart contract to mainnet! 🚀 

Gas fees were surprisingly reasonable at 15 gwei. The contract handles automated yield farming across multiple DeFi protocols. 

Key features:
- Multi-pool liquidity management
- Automated rebalancing
- MEV protection

Code is verified on Etherscan. Link in comments 👇

#DeFi #SmartContracts #Web3`,
    image_url: undefined,
    created_at: BigInt(getRecentTimestamp(0, 2)),
    likes_count: BigInt(23),
    comments_count: BigInt(7),
    liked_by: [mockUsers[1].id, mockUsers[2].id],
  },
  {
    id: generateBlockchainId('post_'),
    author: mockUsers[1].id,
    author_username: mockUsers[1].username,
    content: `🔍 On-chain analysis thread: Why this week's DeFi TVL surge matters

Total Value Locked across all protocols hit $85B+ this week. Here's what's driving it:

1. Institutional adoption accelerating
2. New Layer 2 solutions reducing fees
3. Improved user experience on DEXs
4. Regulatory clarity improving

The best part? We're still early. Traditional finance is just beginning to understand DeFi's potential.

What protocols are you most bullish on? 🧵`,
    image_url: undefined,
    created_at: BigInt(getRecentTimestamp(0, 5)),
    likes_count: BigInt(45),
    comments_count: BigInt(12),
    liked_by: [mockUsers[0].id],
  },
  {
    id: generateBlockchainId('post_'),
    author: mockUsers[2].id,
    author_username: mockUsers[2].username,
    content: `GM Web3! ☀️

Just minted 100 unique NFTs for my new "Blockchain Dreams" collection. Each piece represents a different aspect of our decentralized future.

Features:
✨ Procedurally generated using on-chain randomness
✨ Metadata stored on IPFS
✨ 10% royalties to support digital artists
✨ Utility: Access to exclusive community events

Minting goes live tomorrow at 0.05 ETH each. Early supporters get whitelist access!

Art should be accessible, decentralized, and community-owned. 

#NFT #DigitalArt #Community #Web3`,
    image_url: undefined,
    created_at: BigInt(getRecentTimestamp(0, 8)),
    likes_count: BigInt(67),
    comments_count: BigInt(18),
    liked_by: [mockUsers[0].id, mockUsers[1].id],
  },
  {
    id: generateBlockchainId('post_'),
    author: mockUsers[0].id,
    author_username: mockUsers[0].username,
    content: `PSA: Always verify smart contracts before interacting! 

Saw another rug pull today where users lost $2M+ because they didn't check the contract code. 

Quick security checklist:
- ✅ Contract verified on block explorer
- ✅ Audit reports available
- ✅ Timelock on admin functions  
- ✅ Multi-sig treasury management
- ✅ No hidden mint functions

Stay safe out there! Your seed phrase is your responsibility.

#Security #DeFi #SmartContracts`,
    image_url: undefined,
    created_at: BigInt(getRecentTimestamp(1)),
    likes_count: BigInt(89),
    comments_count: BigInt(24),
    liked_by: [mockUsers[1].id, mockUsers[2].id],
  },
  {
    id: generateBlockchainId('post_'),
    author: mockUsers[1].id,
    author_username: mockUsers[1].username,
    content: `Layer 2 update: Optimistic rollups vs ZK rollups comparison 🧵

After 6 months of using both, here's my honest take:

Optimistic Rollups (Arbitrum, Optimism):
✅ EVM compatibility is perfect
✅ Lower development friction  
❌ 7-day withdrawal delays
❌ Fraud proof assumptions

ZK Rollups (Polygon zkEVM, zkSync):
✅ Instant finality
✅ Mathematical security guarantees
❌ Higher complexity for developers
❌ Limited EVM compatibility (improving)

The future is multi-chain. Both will coexist and serve different use cases.

Which L2 is your daily driver?`,
    image_url: undefined,
    created_at: BigInt(getRecentTimestamp(1, 6)),
    likes_count: BigInt(156),
    comments_count: BigInt(43),
    liked_by: [mockUsers[0].id, mockUsers[2].id],
  },
  {
    id: generateBlockchainId('post_'),
    author: mockUsers[2].id,
    author_username: mockUsers[2].username,
    content: `Web3 UX is finally getting good! 🎉

Remember when you needed to:
- Manage seed phrases manually
- Calculate gas fees yourself  
- Switch networks constantly
- Bridge tokens manually

Now we have:
- Smart wallet abstraction
- Account abstraction (EIP-4337)
- Cross-chain bridges built-in
- Gasless transactions via meta-txs

The infrastructure is maturing. Mass adoption is closer than we think.

Builders: Focus on user experience. That's what will onboard the next billion users to Web3.`,
    image_url: undefined,
    created_at: BigInt(getRecentTimestamp(2, 4)),
    likes_count: BigInt(78),
    comments_count: BigInt(19),
    liked_by: [mockUsers[0].id, mockUsers[1].id],
  },
];

// Enhanced backend status checking
export const checkBackendStatus = async (): Promise<{ connected: boolean; message: string }> => {
  try {
    // Try to fetch from the local dfx network
    const response = await fetch('http://127.0.0.1:4943/api/v2/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      return { connected: true, message: 'Connected to local dfx network' };
    } else {
      return { connected: false, message: 'dfx network running but backend not deployed' };
    }
  } catch (error) {
    return { connected: false, message: 'dfx network not running' };
  }
};

// Generate dynamic trending topics based on current blockchain trends
export const generateTrendingTopics = () => [
  { tag: '#DeFiSummer', posts: Math.floor(Math.random() * 20) + 15, growth: `+${Math.floor(Math.random() * 200) + 50}%`, category: 'DeFi' },
  { tag: '#Layer2Scaling', posts: Math.floor(Math.random() * 15) + 8, growth: `+${Math.floor(Math.random() * 150) + 30}%`, category: 'Technology' },
  { tag: '#NFTUtility', posts: Math.floor(Math.random() * 25) + 10, growth: `+${Math.floor(Math.random() * 180) + 40}%`, category: 'NFTs' },
  { tag: '#SmartContracts', posts: Math.floor(Math.random() * 12) + 6, growth: `+${Math.floor(Math.random() * 120) + 25}%`, category: 'Development' },
  { tag: '#Web3UX', posts: Math.floor(Math.random() * 18) + 7, growth: `+${Math.floor(Math.random() * 160) + 35}%`, category: 'UX/UI' },
];

export default { mockUsers, mockPosts, simulateDelay, checkBackendStatus, generateTrendingTopics };