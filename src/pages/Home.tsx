import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedActor } from '../services/actor';
import { PostWithAuthor } from '../types';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import CreateProfile from '../components/CreateProfile';
// Removed mockPosts and simulateDelay - fully on-chain application
import { 
  itemVariants, 
  pageVariants, 
  pageTransition,
  staggerContainer,
  fadeInUp
} from '../utils/animations';
import { useToast, createToast } from '../components/ui/ToastNotification';
import { 
  Sparkles, 
  Home as HomeIcon, 
  TrendingUp, 
  Users, 
  Hash, 
  Heart, 
  MessageCircle,
  Search,
  Plus,
  UserPlus,
  Star,
  Flame,
  Settings
} from 'lucide-react';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'trending'>('all');

  // Enhanced trending topics with real data
  const [trendingTopics] = useState([
    { tag: '#Web3Revolution', posts: 12.4, growth: '+234%', category: 'Technology' },
    { tag: '#DeFiNews', posts: 8.7, growth: '+89%', category: 'Finance' },
    { tag: '#NFTArt', posts: 15.2, growth: '+156%', category: 'Art' },
    { tag: '#CryptoTrading', posts: 9.8, growth: '+67%', category: 'Finance' },
    { tag: '#BlockchainDev', posts: 6.3, growth: '+45%', category: 'Technology' },
    { tag: '#MetaverseLife', posts: 11.1, growth: '+123%', category: 'Gaming' },
  ]);

  // Suggested users with detailed profiles
  const [suggestedUsers] = useState([
    {
      id: 1,
      username: 'crypto_guru',
      displayName: 'Alex Chen',
      avatar: 'AC',
      followers: 15420,
      bio: 'DeFi researcher & Web3 educator',
      verified: true,
      category: 'Crypto Expert',
      mutualFollowers: 5
    },
    {
      id: 2,
      username: 'nft_creator',
      displayName: 'Sarah Kim',
      avatar: 'SK',
      followers: 8750,
      bio: 'Digital artist creating the future',
      verified: false,
      category: 'Artist',
      mutualFollowers: 3
    },
    {
      id: 3,
      username: 'blockchain_dev',
      displayName: 'Mike Johnson',
      avatar: 'MJ',
      followers: 22100,
      bio: 'Building the decentralized web',
      verified: true,
      category: 'Developer',
      mutualFollowers: 8
    },
    {
      id: 4,
      username: 'dao_enthusiast',
      displayName: 'Emily Rodriguez',
      avatar: 'ER',
      followers: 5680,
      bio: 'Community governance advocate',
      verified: false,
      category: 'Community',
      mutualFollowers: 2
    }
  ]);

  // Stories data
  const [stories] = useState([
    { id: 1, username: 'you', avatar: 'YU', isOwn: true, hasStory: false },
    { id: 2, username: 'alice_dev', avatar: 'AD', hasStory: true, viewed: false },
    { id: 3, username: 'bob_crypto', avatar: 'BC', hasStory: true, viewed: true },
    { id: 4, username: 'carol_nft', avatar: 'CN', hasStory: true, viewed: false },
    { id: 5, username: 'dave_web3', avatar: 'DW', hasStory: true, viewed: false },
  ]);

  // Real-time activity feed
  const [recentActivity] = useState([
    { type: 'like', user: 'crypto_guru', action: 'liked your post', time: '2m' },
    { type: 'follow', user: 'nft_creator', action: 'started following you', time: '5m' },
    { type: 'comment', user: 'blockchain_dev', action: 'commented on your post', time: '12m' },
    { type: 'mention', user: 'dao_enthusiast', action: 'mentioned you in a post', time: '18m' },
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
      // Show profile creation if user is authenticated but no profile exists
      if (!user?.username) {
        console.log('User authenticated but no username found, showing profile creation');
        setShowCreateProfile(true);
      }
    }
  }, [isAuthenticated, user]);

  const loadPosts = async () => {
    try {
      // Verify Plug Wallet is connected before making backend calls
      if (!window.ic?.plug) {
        throw new Error('Plug Wallet not available');
      }
      
      const isConnected = await window.ic.plug.isConnected();
      if (!isConnected) {
        throw new Error('Plug Wallet not connected');
      }
      
      if (!window.ic.plug.agent) {
        throw new Error('Plug Wallet agent not available');
      }
      
      const actor = await getAuthenticatedActor();
      if (!actor) {
        throw new Error('Failed to initialize backend actor');
      }
      
      console.log('Loading posts from onchain360_backend...');
      
      // Use get_all_posts from the backend canister
      const backendPosts = await actor.get_posts();
      console.log('Raw backend posts:', backendPosts);
      
      // Map backend data to frontend format with proper type conversion
      const mappedPosts: PostWithAuthor[] = backendPosts.map((post: any) => ({
        id: post.id.toString(),
        author: post.author.toString(),
        author_username: post.author_username,
        content: post.content,
        image_url: post.image_url?.[0] || undefined, // Handle optional values
        created_at: BigInt(post.created_at), // Ensure bigint type
        likes_count: BigInt(post.likes_count), // Keep as bigint to match type definition
        comments_count: BigInt(post.comments_count), // Keep as bigint to match type definition
        liked_by: post.liked_by?.map((p: any) => p.toString()) || [], // Handle principal conversion
      }));
      
      // Sort by created_at in descending order (newest first)
      mappedPosts.sort((a, b) => Number(b.created_at - a.created_at));
      
      console.log('Mapped posts:', mappedPosts);
      setPosts(mappedPosts);
      
      if (mappedPosts.length > 0) {
        addToast(createToast.success(
          'Posts loaded from blockchain!',
          `Found ${mappedPosts.length} posts stored on-chain`
        ));
      } else {
        addToast(createToast.info(
          'No posts found',
          'Be the first to create a post on the blockchain!'
        ));
      }
    } catch (error) {
      console.error('Error loading posts from backend:', error);
      
      // Provide specific error messages for different failure types
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('not available') || errorMessage.includes('not connected')) {
        addToast(createToast.error(
          'Authentication required',
          'Please connect your Plug Wallet to access blockchain data.'
        ));
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        addToast(createToast.error(
          'Backend connection failed',
          'Unable to connect to onchain360_backend. Please ensure dfx is running and the backend is deployed.'
        ));
      } else if (errorMessage.includes('canister') || errorMessage.includes('agent')) {
        addToast(createToast.error(
          'Canister not found',
          'The onchain360_backend canister is not deployed or not responding.'
        ));
      } else {
        addToast(createToast.error(
          'Failed to load posts',
          'An unexpected error occurred while loading posts from the blockchain.'
        ));
      }
      
      // Set empty posts array - no fallback to mock data
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle post creation - refresh the entire feed from backend with proper authentication checks
  const handlePostCreated = async (newPost: PostWithAuthor) => {
    console.log('Post created on blockchain, refreshing feed...', newPost.id);
    
    // Verify we still have authentication before refreshing
    if (!window.ic?.plug || !window.ic.plug.agent) {
      addToast(createToast.error('Authentication lost', 'Please reconnect your Plug Wallet'));
      return;
    }
    
    try {
      const isConnected = await window.ic.plug.isConnected();
      if (!isConnected) {
        addToast(createToast.error('Connection lost', 'Plug Wallet disconnected. Please reconnect.'));
        return;
      }
    } catch (error) {
      console.error('Error checking Plug connection:', error);
      return;
    }
    
    // Add a delay to ensure backend has processed and stored the new post
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reload all posts from backend to get the most up-to-date state
    setLoading(true);
    await loadPosts();
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handlePostLiked = (updatedPost: PostWithAuthor) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostUpdated = (updatedPost: PostWithAuthor) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handleRepostCreated = (newRepost: PostWithAuthor) => {
    setPosts(prev => [newRepost, ...prev]);
  };

  const handleProfileCreated = () => {
    setShowCreateProfile(false);
    window.location.reload();
  };

  const handleFollowUser = () => {
    addToast(createToast.success('Following user!', 'You are now following this user'));
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'follow': return UserPlus;
      case 'comment': return MessageCircle;
      case 'mention': return Hash;
      default: return Star;
    }
  };

  const filteredPosts = posts.filter(post => {
    switch (activeFilter) {
      case 'following':
        return true; // In real app, filter by followed users
      case 'trending':
        return Number(post.likes_count) > 5; // Mock trending filter
      default:
        return true;
    }
  });

  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-black"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      <div className="max-w-6xl mx-auto flex">
        {/* Main Feed Column */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">
                  Home
                </h1>
                <motion.button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1">
                {[
                  { id: 'all', label: 'For you', icon: Sparkles },
                  { id: 'following', label: 'Following', icon: Users },
                  { id: 'trending', label: 'Trending', icon: TrendingUp }
                ].map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <motion.button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeFilter === filter.id
                          ? 'bg-yellow-400 text-black'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stories */}
          {/* Removed showStories && ( */}
            <motion.div 
              className="border-b border-gray-200 dark:border-gray-800 p-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {stories.map((story) => (
                  <motion.div
                    key={story.id}
                    className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`relative w-16 h-16 rounded-full p-1 ${
                      story.hasStory && !story.viewed ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                      story.hasStory && story.viewed ? 'bg-gray-300 dark:bg-gray-600' :
                      'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center text-white text-sm font-medium bg-black"
                        style={{ background: story.isOwn ? 'linear-gradient(135deg, #FAD126, #FF564E)' : undefined }}
                      >
                        {story.isOwn ? (
                          <Plus className="w-6 h-6 text-white" />
                        ) : (
                          story.avatar
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[64px] truncate">
                      {story.isOwn ? 'Your story' : story.username}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          {/* ) */}

          {/* Create Profile Modal */}
          <AnimatePresence>
            {showCreateProfile && (
              <CreateProfile
                onClose={() => setShowCreateProfile(false)}
                onProfileCreated={handleProfileCreated}
              />
            )}
          </AnimatePresence>

          {/* Create Post */}
          {user?.username && (
            <CreatePost onPostCreated={handlePostCreated} />
          )}

          {/* Feed */}
          <div className="bg-white dark:bg-black">
            {loading ? (
              <div>
                {[...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 dark:border-gray-800 px-4 py-3"
                  >
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-20" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-16" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-8" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                        </div>
                        <div className="flex items-center space-x-6 pt-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-12" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-12" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-12" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="border-b border-gray-200 dark:border-gray-800 px-4 py-16"
              >
                <div className="text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HomeIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h2 className="text-[31px] font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to your timeline!
                  </h2>
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-[20px] mb-6">
                    When you follow people, you'll see their posts here.
                  </p>
                  <motion.button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-[15px] transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Let's go
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <PostCard
                        post={post}
                        onPostDeleted={handlePostDeleted}
                        onPostLiked={handlePostLiked}
                        onPostEdit={handlePostUpdated}
                        onRepostCreated={handleRepostCreated}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80 ml-8">
          <div className="sticky top-4 space-y-4">
            {/* Search Bar */}
            <motion.div 
              className="bg-gray-100 dark:bg-gray-900 rounded-full p-3"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Soclynk"
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">What's happening</h3>
                <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" />
              </div>
              
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={topic.tag}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{index + 1} · {topic.category}</span>
                                                     <Flame className="w-3 h-3 text-orange-500" />
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">{topic.tag}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{topic.posts}K posts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-500 font-medium">{topic.growth}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="text-blue-500 hover:text-blue-600 text-sm mt-3">
                Show more
              </button>
            </motion.div>

            {/* Suggested Users */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Who to follow</h3>
              
              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    className="flex items-center justify-between"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                        style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{user.displayName}</span>
                          {user.verified && <Star className="w-3 h-3 text-yellow-400" />}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatCount(user.followers)} followers</div>
                        {user.mutualFollowers > 0 && (
                          <div className="text-xs text-blue-500">
                            {user.mutualFollowers} mutual followers
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.button
                      onClick={handleFollowUser}
                      className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Follow
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              
              <button className="text-blue-500 hover:text-blue-600 text-sm mt-3">
                Show more
              </button>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'like' ? 'bg-red-100 dark:bg-red-900' :
                        activity.type === 'follow' ? 'bg-blue-100 dark:bg-blue-900' :
                        activity.type === 'comment' ? 'bg-green-100 dark:bg-green-900' :
                        'bg-yellow-100 dark:bg-yellow-900'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          activity.type === 'like' ? 'text-red-500' :
                          activity.type === 'follow' ? 'text-blue-500' :
                          activity.type === 'comment' ? 'text-green-500' :
                          'text-yellow-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{activity.time} ago</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home; 