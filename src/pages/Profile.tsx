import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedActor } from '../services/actor';
import { PostWithAuthor } from '../types';
import PostCard from '../components/PostCard';
import CreateProfile from '../components/CreateProfile';
import { 
  Edit2, 
  Calendar, 
  MessageCircle, 
  Heart, 
  MapPin, 
  Users,
  Award,
  TrendingUp,
  Share,
  Star,
  BarChart3,
  Eye,
  Activity,
  Shield,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Crown,
  Trophy
} from 'lucide-react';
import { 
  pageVariants, 
  pageTransition, 
  fadeInUp, 
  staggerContainer, 
  itemVariants,
  shimmerVariants 
} from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { useToast, createToast } from '../components/ui/ToastNotification';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [profileStats, setProfileStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    joinedDate: new Date(),
    followers: 1247,
    following: 392,
  });

  // Enhanced analytics data
  const [analytics] = useState({
    impressions: 245600,
    engagementRate: 8.4,
    topPost: { views: 12400, likes: 456, title: 'Web3 Future Predictions' },
    monthlyGrowth: 23.5,
    averageLikes: 89,
    averageComments: 12,
    bestPerformingHour: '2 PM',
    topHashtags: ['#web3', '#defi', '#nft', '#blockchain'],
    reachIncrease: 18.2,
    profileViews: 3420
  });

  // Achievement badges
  const [achievements] = useState([
    { 
      id: 'early_adopter', 
      name: 'Early Adopter', 
      description: 'Joined in the first 1000 users', 
      icon: Star, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      earned: true,
      earnedDate: '2024-01-15'
    },
    { 
      id: 'content_creator', 
      name: 'Content Creator', 
      description: 'Posted 50+ high-quality posts', 
      icon: Award, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      earned: true,
      earnedDate: '2024-02-10'
    },
    { 
      id: 'community_builder', 
      name: 'Community Builder', 
      description: 'Helped 100+ users with comments', 
      icon: Users, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      earned: true,
      earnedDate: '2024-03-05'
    },
    { 
      id: 'trending_master', 
      name: 'Trending Master', 
      description: 'Had 5 posts reach trending', 
      icon: TrendingUp, 
      color: 'text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
      earned: true,
      earnedDate: '2024-03-20'
    },
    { 
      id: 'influencer', 
      name: 'Influencer', 
      description: 'Reached 1000+ followers', 
      icon: Crown, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      earned: true,
      earnedDate: '2024-04-01'
    },
    { 
      id: 'web3_expert', 
      name: 'Web3 Expert', 
      description: 'Verified knowledge in blockchain', 
      icon: Shield, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900',
      earned: false,
      progress: 75
    }
  ]);

  // Activity timeline
  const [recentActivity] = useState([
    { 
      type: 'post', 
      action: 'Published a new post about DeFi trends', 
      time: '2 hours ago',
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    { 
      type: 'like', 
      action: 'Received 50+ likes on "Blockchain Basics"', 
      time: '5 hours ago',
      icon: Heart,
      color: 'text-red-500'
    },
    { 
      type: 'follow', 
      action: 'Gained 15 new followers', 
      time: '1 day ago',
      icon: UserPlus,
      color: 'text-green-500'
    },
    { 
      type: 'comment', 
      action: 'Replied to 8 comments on your posts', 
      time: '2 days ago',
      icon: MessageSquare,
      color: 'text-purple-500'
    },
    { 
      type: 'trending', 
      action: 'Your post made it to trending #3', 
      time: '3 days ago',
      icon: TrendingUp,
      color: 'text-orange-500'
    },
    { 
      type: 'milestone', 
      action: 'Reached 1000 total likes milestone', 
      time: '1 week ago',
      icon: Trophy,
      color: 'text-yellow-500'
    }
  ]);

  // Content insights
  const [contentInsights] = useState({
    bestDay: 'Tuesday',
    bestTime: '2:00 PM',
    avgEngagement: '8.4%',
    topContentType: 'Educational',
    reachGrowth: '+18.2%',
    impressionGrowth: '+25.7%'
  });

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      loadUserPosts();
      calculateProfileStats();
    }
  }, [isAuthenticated, user]);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const actor = await getAuthenticatedActor();
      const postsData = await actor.get_user_posts(Principal.fromText(user.id));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading user posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileStats = () => {
    if (posts.length > 0) {
      const totalLikes = posts.reduce((sum, post) => sum + Number(post.likes_count), 0);
      const totalComments = posts.reduce((sum, post) => sum + Number(post.comments_count), 0);
      
      setProfileStats({
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        joinedDate: new Date(2024, 0, 1),
        followers: 1247,
        following: 392,
      });
    }
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

  const handleProfileUpdated = () => {
    setShowEditProfile(false);
    window.location.reload();
  };

  const handleFollowersClick = () => {
    addToast(createToast.info('Coming Soon', 'Followers list feature is in development'));
  };

  const handleFollowingClick = () => {
    addToast(createToast.info('Coming Soon', 'Following list feature is in development'));
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: MessageSquare, count: posts.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: null },
    { id: 'achievements', label: 'Achievements', icon: Award, count: achievements.filter(a => a.earned).length },
    { id: 'activity', label: 'Activity', icon: Activity, count: null }
  ];

  if (!user?.username) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900/50 dark:to-orange-900/50 flex items-center justify-center"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
      >
        <CreateProfile
          onClose={() => {}}
          onProfileCreated={handleProfileUpdated}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900/50 dark:to-orange-900/50"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      <div className="max-w-4xl mx-auto relative">
        {/* Profile Header */}
        <motion.div
          className="relative mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Cover Background */}
          <div className="h-48 rounded-b-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(250, 209, 38, 0.2), rgba(255, 86, 78, 0.2))' }}
              variants={shimmerVariants}
              animate="animate"
            />
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-20 left-8 w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          {/* Profile Content */}
          <div className="relative px-6 -mt-16">
            <GlassCard intensity="medium" className="border-white/20 dark:border-gray-700/30 p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl border-4 border-white/20"
                    style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                  >
                    {getInitials(user.username)}
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </motion.div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {user.username}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 md:mt-0">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {user.bio || 'Building the future of decentralized social media 🚀'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-center md:justify-start space-x-6 mb-4">
                    <motion.button
                      onClick={handleFollowersClick}
                      className="text-center hover:text-yellow-500 transition-colors group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors">
                        {formatNumber(profileStats.followers)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                    </motion.button>
                    
                    <motion.button
                      onClick={handleFollowingClick}
                      className="text-center hover:text-yellow-500 transition-colors group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors">
                        {formatNumber(profileStats.following)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                    </motion.button>
                    
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
                        {profileStats.totalPosts}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
                    </div>
                  </div>

                  {/* Join Date & Location */}
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatJoinDate(profileStats.joinedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Decentralized Web</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <AnimatedButton
                    onClick={() => setShowEditProfile(true)}
                    variant="ghost"
                    className="border border-gray-300 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-400"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </AnimatedButton>
                  
                  <AnimatedButton variant="ghost">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="px-6 mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-1 bg-white/50 dark:bg-gray-900/50 rounded-full p-1 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-800/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-white/20' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <LoadingSkeleton key={index} variant="post" />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start sharing your thoughts with the community!
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
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
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Profile Views', value: formatNumber(analytics.profileViews), change: `+${analytics.reachIncrease}%`, icon: Eye, color: 'text-blue-500' },
                    { label: 'Impressions', value: formatNumber(analytics.impressions), change: '+25.7%', icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Engagement Rate', value: `${analytics.engagementRate}%`, change: '+2.1%', icon: Heart, color: 'text-red-500' },
                    { label: 'Avg. Likes', value: analytics.averageLikes.toString(), change: '+18%', icon: ThumbsUp, color: 'text-purple-500' }
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <GlassCard key={metric.label} intensity="light" className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                          <span className="text-xs text-green-500 font-medium">{metric.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {metric.label}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>

                {/* Content Insights */}
                <GlassCard intensity="medium" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">{contentInsights.bestDay}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Best posting day</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{contentInsights.bestTime}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Optimal posting time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{contentInsights.topContentType}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Top content type</div>
                    </div>
                  </div>
                </GlassCard>

                {/* Top Hashtags */}
                <GlassCard intensity="medium" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.topHashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                          achievement.earned 
                            ? 'border-yellow-300 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' 
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.bgColor}`}>
                              <Icon className={`w-6 h-6 ${achievement.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {achievement.name}
                                </h3>
                                {achievement.earned && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {achievement.description}
                              </p>
                              {achievement.earned ? (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Earned on {achievement.earnedDate}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Progress: {achievement.progress}%
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${achievement.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {achievement.earned && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard intensity="medium" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm`}>
                            <Icon className={`w-5 h-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white font-medium">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditProfile && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CreateProfile
                  onClose={() => setShowEditProfile(false)}
                  onProfileCreated={handleProfileUpdated}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile; 