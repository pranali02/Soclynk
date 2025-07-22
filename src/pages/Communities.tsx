import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Star,
  Calendar,
  Crown,
  Shield,
  Hash,
  TrendingUp,
  MessageCircle,
  UserPlus,
  Lock,
  Eye,
  Bookmark,
  Share2
} from 'lucide-react';
import { pageVariants, pageTransition, staggerContainer, fadeInUp, cardVariants } from '../utils/animations';
import { useToast, createToast } from '../components/ui/ToastNotification';
import AnimatedButton from '../components/ui/AnimatedButton';

const Communities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'joined' | 'created'>('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<number[]>([2, 5]);
  const { addToast } = useToast();

  // Enhanced communities data with more realistic information
  const discoverCommunities = [
    {
      id: 1,
      name: 'Web3 Developers',
      description: 'A thriving community for Web3 developers to share knowledge, discuss latest trends, and collaborate on groundbreaking decentralized applications. Join thousands of passionate builders.',
      members: 25400,
      posts: 1250,
      dailyPosts: 45,
      isJoined: joinedCommunityIds.includes(1),
      category: 'Technology',
      tags: ['#Web3', '#Blockchain', '#DeFi', '#Smart Contracts'],
      moderators: 12,
      isVerified: true,
      coverImage: '',
      activity: 'Very Active',
      privacy: 'Public',
      created: '2022-03-15',
      featured: true,
      engagement: 94,
      growthRate: '+12%'
    },
    {
      id: 2,
      name: 'Crypto Traders',
      description: 'Professional trading strategies, comprehensive market analysis, and cryptocurrency discussions for both beginners and seasoned experts in the digital asset space.',
      members: 18200,
      posts: 856,
      dailyPosts: 28,
      isJoined: joinedCommunityIds.includes(2),
      category: 'Finance',
      tags: ['#Crypto', '#Trading', '#Analysis', '#Forex'],
      moderators: 8,
      isVerified: true,
      coverImage: '',
      activity: 'Active',
      privacy: 'Public',
      created: '2021-11-08',
      featured: true,
      engagement: 87,
      growthRate: '+8%'
    },
    {
      id: 3,
      name: 'NFT Artists & Collectors',
      description: 'Showcase your digital masterpieces, get constructive feedback, and connect with fellow NFT creators, collectors, and enthusiasts in this vibrant creative community.',
      members: 12800,
      posts: 2340,
      dailyPosts: 67,
      isJoined: joinedCommunityIds.includes(3),
      category: 'Art & Design',
      tags: ['#NFT', '#DigitalArt', '#Creators', '#OpenSea'],
      moderators: 15,
      isVerified: false,
      coverImage: '',
      activity: 'Very Active',
      privacy: 'Public',
      created: '2022-01-20',
      featured: false,
      engagement: 91,
      growthRate: '+15%'
    },
    {
      id: 4,
      name: 'DeFi Protocols Hub',
      description: 'Deep dive into decentralized finance protocols, advanced yield farming strategies, liquidity mining opportunities, and the latest DeFi innovations.',
      members: 9600,
      posts: 567,
      dailyPosts: 19,
      isJoined: joinedCommunityIds.includes(4),
      category: 'Finance',
      tags: ['#DeFi', '#Yield', '#Protocols', '#Liquidity'],
      moderators: 6,
      isVerified: true,
      coverImage: '',
      activity: 'Active',
      privacy: 'Public',
      created: '2022-06-03',
      featured: false,
      engagement: 83,
      growthRate: '+6%'
    },
    {
      id: 5,
      name: 'Metaverse Builders',
      description: 'Building the future of virtual worlds, immersive VR/AR experiences, and next-generation digital economies. Connect with visionary developers and creators.',
      members: 7300,
      posts: 423,
      dailyPosts: 12,
      isJoined: joinedCommunityIds.includes(5),
      category: 'Technology',
      tags: ['#Metaverse', '#VR', '#Gaming', '#Unity'],
      moderators: 4,
      isVerified: false,
      coverImage: '',
      activity: 'Moderate',
      privacy: 'Public',
      created: '2022-08-14',
      featured: false,
      engagement: 76,
      growthRate: '+4%'
    },
    {
      id: 6,
      name: 'AI & Machine Learning',
      description: 'Explore cutting-edge artificial intelligence research, machine learning algorithms, and their practical applications in modern technology.',
      members: 15600,
      posts: 1890,
      dailyPosts: 52,
      isJoined: joinedCommunityIds.includes(6),
      category: 'Technology',
      tags: ['#AI', '#MachineLearning', '#Python', '#TensorFlow'],
      moderators: 10,
      isVerified: true,
      coverImage: '',
      activity: 'Very Active',
      privacy: 'Public',
      created: '2021-09-12',
      featured: true,
      engagement: 89,
      growthRate: '+18%'
    },
    {
      id: 7,
      name: 'Startup Founders',
      description: 'Connect with fellow entrepreneurs, share startup experiences, get funding advice, and build the next generation of innovative companies.',
      members: 11200,
      posts: 789,
      dailyPosts: 31,
      isJoined: joinedCommunityIds.includes(7),
      category: 'Business',
      tags: ['#Startup', '#Entrepreneurship', '#Funding', '#Business'],
      moderators: 7,
      isVerified: true,
      coverImage: '',
      activity: 'Active',
      privacy: 'Public',
      created: '2022-02-28',
      featured: false,
      engagement: 85,
      growthRate: '+10%'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories', icon: Users, count: discoverCommunities.length },
    { id: 'Technology', name: 'Technology', icon: Hash, count: discoverCommunities.filter(c => c.category === 'Technology').length },
    { id: 'Finance', name: 'Finance', icon: TrendingUp, count: discoverCommunities.filter(c => c.category === 'Finance').length },
    { id: 'Art & Design', name: 'Art & Design', icon: Star, count: discoverCommunities.filter(c => c.category === 'Art & Design').length },
    { id: 'Business', name: 'Business', icon: Users, count: discoverCommunities.filter(c => c.category === 'Business').length }
  ];

  const joinedCommunities = discoverCommunities.filter(community => community.isJoined);
  const createdCommunities: any[] = []; // User hasn't created any communities yet

  // Filter communities based on search and category
  const filteredCommunities = discoverCommunities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinCommunity = (communityId: number) => {
    const community = discoverCommunities.find(c => c.id === communityId);
    if (community) {
      if (joinedCommunityIds.includes(communityId)) {
        setJoinedCommunityIds(prev => prev.filter(id => id !== communityId));
        addToast(createToast.info('Left community', `You left ${community.name}`));
      } else {
        setJoinedCommunityIds(prev => [...prev, communityId]);
        addToast(createToast.success('Joined community!', `Welcome to ${community.name}`));
      }
    }
  };

  const handleCreateCommunity = () => {
    addToast(createToast.info('Coming soon', 'Community creation feature will be available soon'));
  };

  const handleBookmarkCommunity = (communityId: number) => {
    const community = discoverCommunities.find(c => c.id === communityId);
    addToast(createToast.success('Bookmarked!', `${community?.name} saved to your bookmarks`));
  };

  const handleShareCommunity = (communityId: number) => {
    const community = discoverCommunities.find(c => c.id === communityId);
    addToast(createToast.success('Link copied!', `${community?.name} link copied to clipboard`));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'Very Active': return 'text-green-400';
      case 'Active': return 'text-yellow-400';
      case 'Moderate': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'discover', label: 'Discover', count: discoverCommunities.length },
    { id: 'joined', label: 'Joined', count: joinedCommunities.length },
    { id: 'created', label: 'Created', count: createdCommunities.length }
  ];

  const getCurrentCommunities = () => {
    switch (activeTab) {
      case 'joined':
        return joinedCommunities;
      case 'created':
        return createdCommunities;
      default:
        return filteredCommunities;
    }
  };

  const currentCommunities = getCurrentCommunities();

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return 'text-green-400';
    if (engagement >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <motion.div 
              className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 p-4 z-10"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold flex items-center">
                  <Users className="w-6 h-6 mr-2 text-yellow-400" />
                  Communities
                  <span className="ml-3 text-sm font-normal text-gray-400">
                    {currentCommunities.length} communities
                  </span>
                </h1>
                <AnimatedButton
                  onClick={handleCreateCommunity}
                  className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-500"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </AnimatedButton>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communities by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 rounded-full py-3 pl-12 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-gray-800 transition-all duration-200"
                />
                <motion.button
                  className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Shield className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Category Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    className="mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-800"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-400 mb-3">Filter by category:</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                          <motion.button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                              isSelected
                                ? 'bg-yellow-400 text-black'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{category.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-black/20' : 'bg-gray-700'
                            }`}>
                              {category.count}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-900 rounded-full p-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-yellow-400 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          activeTab === tab.id ? 'bg-black/20' : 'bg-gray-700'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Communities List */}
            <motion.div 
              className="p-4 space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {currentCommunities.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  variants={fadeInUp}
                >
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    {activeTab === 'created' ? 'No communities created yet' : 'No communities found'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'created' 
                      ? 'Create your first community to get started'
                      : searchTerm ? 'Try adjusting your search terms' : 'Start by joining some communities'
                    }
                  </p>
                  {activeTab === 'created' && (
                    <AnimatedButton 
                      onClick={handleCreateCommunity}
                      className="bg-yellow-400 text-black px-6 py-3 rounded-full font-medium hover:bg-yellow-500"
                    >
                      Create Community
                    </AnimatedButton>
                  )}
                </motion.div>
              ) : (
                currentCommunities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    className="group relative overflow-hidden border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-300"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Featured badge */}
                    {community.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center space-x-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3" />
                          <span>Featured</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          {/* Community Avatar */}
                          <motion.div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {getInitials(community.name)}
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-bold text-white truncate group-hover:text-yellow-300 transition-colors duration-200">
                                {community.name}
                              </h3>
                              {community.isVerified && (
                                <motion.div 
                                  className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                  whileHover={{ scale: 1.2 }}
                                >
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                              )}
                              <div className="flex items-center space-x-1">
                                {community.privacy === 'Public' ? (
                                  <Shield className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Lock className="w-4 h-4 text-orange-400" />
                                )}
                                <span className="text-xs text-gray-400">{community.privacy}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{community.members.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{community.posts}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{community.dailyPosts}/day</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${getActivityColor(community.activity)}`}>
                                <TrendingUp className="w-4 h-4" />
                                <span>{community.activity}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                                {community.category}
                              </span>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Crown className="w-3 h-3" />
                                <span>{community.moderators} mods</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>Since {new Date(community.created).getFullYear()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className={`text-xs font-medium ${getEngagementColor(community.engagement)}`}>
                                  {community.engagement}% engaged
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <motion.button 
                            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleBookmarkCommunity(community.id)}
                          >
                            <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                          </motion.button>
                          <motion.button 
                            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShareCommunity(community.id)}
                          >
                            <Share2 className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed group-hover:text-gray-200 transition-colors duration-200">
                        {community.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {community.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <motion.span 
                              key={tagIndex}
                              className="text-xs bg-gray-800/50 text-yellow-400 px-3 py-1 rounded-full border border-gray-700 hover:bg-yellow-400/10 cursor-pointer transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                          {community.tags.length > 3 && (
                            <span className="text-xs text-gray-500 px-3 py-1">
                              +{community.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-xs text-green-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>{community.growthRate}</span>
                          </div>
                          
                          <AnimatedButton
                            onClick={() => handleJoinCommunity(community.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                              community.isJoined
                                ? 'bg-gray-800 text-white hover:bg-red-600 hover:text-white'
                                : 'bg-yellow-400 text-black hover:bg-yellow-500'
                            }`}
                          >
                            {community.isJoined ? (
                              <>
                                <UserPlus className="w-4 h-4" />
                                <span>Leave</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4" />
                                <span>Join</span>
                              </>
                            )}
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Popular Categories */}
            <motion.div 
              className="bg-gray-900/50 rounded-xl p-4 mb-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="font-bold text-lg mb-4">Popular Categories</h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Technology', count: 245, icon: Hash },
                  { name: 'Finance', count: 189, icon: TrendingUp },
                  { name: 'Art & Design', count: 156, icon: Star },
                  { name: 'Gaming', count: 134, icon: Users },
                  { name: 'Education', count: 98, icon: Shield }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{category.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community Guidelines */}
            <motion.div 
              className="bg-gray-900/50 rounded-xl p-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="font-bold text-lg mb-4">Community Guidelines</h3>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Be respectful and civil in all interactions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Hash className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Stay on topic and relevant to the community</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Share quality content and meaningful discussions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Help newcomers and foster inclusivity</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Communities; 