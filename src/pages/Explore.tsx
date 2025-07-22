import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Hash, 
  MapPin, 
  Calendar,
  Users,
  Heart,
  MoreHorizontal,
  Filter,
  Star,
  Eye,
  Clock,
  Globe,
  Zap,
  Target
} from 'lucide-react';
import { pageVariants, pageTransition, staggerContainer, fadeInUp, cardVariants } from '../utils/animations';
import { useToast, createToast } from '../components/ui/ToastNotification';
import AnimatedButton from '../components/ui/AnimatedButton';

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'news' | 'sports' | 'entertainment'>('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const { addToast } = useToast();

  // Enhanced trending data with more realistic information
  const trendingTopics = [
    {
      id: 1,
      category: 'Technology',
      hashtag: '#Web3Revolution',
      posts: '342K',
      growth: '+145%',
      description: 'The future of decentralized internet is here',
      engagement: 95,
      timeframe: '24h'
    },
    {
      id: 2,
      category: 'Cryptocurrency',
      hashtag: '#Bitcoin',
      posts: '1.2M',
      growth: '+67%',
      description: 'Bitcoin reaches new milestone in adoption',
      engagement: 89,
      timeframe: '12h'
    },
    {
      id: 3,
      category: 'AI & Machine Learning',
      hashtag: '#AIBreakthrough',
      posts: '567K',
      growth: '+234%',
      description: 'Revolutionary AI model changes everything',
      engagement: 92,
      timeframe: '6h'
    },
    {
      id: 4,
      category: 'Social Media',
      hashtag: '#SoclynkCommunity',
      posts: '89K',
      growth: '+189%',
      description: 'Building the future of social networking',
      engagement: 96,
      timeframe: '3h'
    },
    {
      id: 5,
      category: 'Programming',
      hashtag: '#ReactNext',
      posts: '234K',
      growth: '+78%',
      description: 'React 19 features transforming development',
      engagement: 85,
      timeframe: '8h'
    },
    {
      id: 6,
      category: 'Blockchain',
      hashtag: '#DeFiInnovation',
      posts: '445K',
      growth: '+123%',
      description: 'Decentralized finance reshaping banking',
      engagement: 88,
      timeframe: '5h'
    }
  ];

  // Enhanced suggested users with more details
  const suggestedUsers = [
    {
      id: 1,
      username: 'vitalik_eth',
      handle: '@VitalikButerin',
      bio: 'Ethereum co-founder • Building the decentralized future',
      followers: '5.2M',
      following: '1.2K',
      posts: '12.5K',
      isVerified: true,
      category: 'Tech Leader',
      engagement: 94,
      lastActive: '2h ago'
    },
    {
      id: 2,
      username: 'naval',
      handle: '@naval',
      bio: 'Entrepreneur • Investor • Philosophy & Wisdom',
      followers: '1.8M',
      following: '890',
      posts: '8.3K',
      isVerified: true,
      category: 'Entrepreneur',
      engagement: 97,
      lastActive: '1h ago'
    },
    {
      id: 3,
      username: 'elonmusk',
      handle: '@elonmusk',
      bio: 'Tesla • SpaceX • Changing the world one tweet at a time',
      followers: '150M',
      following: '543',
      posts: '45.2K',
      isVerified: true,
      category: 'Innovator',
      engagement: 91,
      lastActive: '30m ago'
    },
    {
      id: 4,
      username: 'satya_nadella',
      handle: '@satyanadella',
      bio: 'CEO Microsoft • Empowering every person and organization',
      followers: '2.1M',
      following: '1.5K',
      posts: '3.8K',
      isVerified: true,
      category: 'Tech CEO',
      engagement: 89,
      lastActive: '4h ago'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All', icon: Globe },
    { id: 'technology', name: 'Technology', icon: Zap },
    { id: 'crypto', name: 'Crypto', icon: Target },
    { id: 'ai', name: 'AI/ML', icon: Star },
    { id: 'programming', name: 'Programming', icon: Hash },
    { id: 'business', name: 'Business', icon: TrendingUp }
  ];

  // Simulate search functionality
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const results = [
          ...trendingTopics.filter(topic => 
            topic.hashtag.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.description.toLowerCase().includes(searchTerm.toLowerCase())
          ),
          ...suggestedUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ];
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      addToast(createToast.info('Searching...', `Looking for "${term}"`));
    }
  };

  const handleFollowUser = () => {
    addToast(createToast.success('Following!', 'You\'re now following this user'));
  };

  const handleTopicClick = (hashtag: string) => {
    addToast(createToast.info('Exploring topic', `Showing posts for ${hashtag}`));
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return 'text-green-400';
    if (engagement >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp, count: trendingTopics.length },
    { id: 'news', label: 'News', icon: Hash, count: 24 },
    { id: 'sports', label: 'Sports', icon: Users, count: 12 },
    { id: 'entertainment', label: 'Entertainment', icon: Heart, count: 18 }
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div 
              className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 p-4 z-10"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h1 className="text-2xl font-bold mb-4">Explore</h1>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Soclynk"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-gray-900 rounded-full py-3 pl-12 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-gray-800 transition-all duration-200"
                />
                <motion.button
                  className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Filter className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Category Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    className="mb-4 p-3 bg-gray-900/50 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-400 mb-2">Filter by category:</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                          <motion.button
                            key={category.id}
                            onClick={() => {
                              if (category.id === 'all') {
                                setSelectedCategories(['all']);
                              } else {
                                setSelectedCategories(prev => 
                                  prev.includes(category.id) 
                                    ? prev.filter(id => id !== category.id)
                                    : [...prev.filter(id => id !== 'all'), category.id]
                                );
                              }
                            }}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                              isSelected
                                ? 'bg-yellow-400 text-black'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{category.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Results */}
              <AnimatePresence>
                {searchTerm.length > 2 && (
                  <motion.div
                    className="mb-4 p-3 bg-gray-900/50 rounded-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-400 mb-2">
                      {isSearching ? 'Searching...' : `Found ${searchResults.length} results for "${searchTerm}"`}
                    </p>
                    {!isSearching && searchResults.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {searchResults.slice(0, 5).map((result, index) => (
                          <motion.div
                            key={index}
                            className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {result.hashtag ? (
                              <div onClick={() => handleTopicClick(result.hashtag)}>
                                <p className="text-yellow-400 font-medium">{result.hashtag}</p>
                                <p className="text-xs text-gray-400">{result.posts} posts</p>
                              </div>
                            ) : (
                              <div onClick={() => handleFollowUser()}>
                                <p className="text-white font-medium">@{result.username}</p>
                                <p className="text-xs text-gray-400">{result.followers} followers</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-900 rounded-full p-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'bg-yellow-400 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-black/20' : 'bg-gray-700'
                      }`}>
                        {tab.count}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div 
              className="p-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                What's happening
              </h2>
              
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    className="group relative overflow-hidden border border-gray-800 rounded-xl hover:border-gray-700 cursor-pointer transition-all duration-300"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTopicClick(topic.hashtag)}
                  >
                    {/* Gradient hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <motion.span 
                              className="text-yellow-400 font-bold text-sm"
                              whileHover={{ scale: 1.1 }}
                            >
                              #{index + 1}
                            </motion.span>
                            <span className="text-sm text-gray-400">·</span>
                            <span className="text-sm text-gray-400">{topic.category}</span>
                            <span className="text-sm text-gray-400">·</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-500">{topic.timeframe}</span>
                            </div>
                          </div>
                          
                          <motion.h3 
                            className="font-bold text-lg text-white mb-2 group-hover:text-yellow-300 transition-colors duration-200"
                            whileHover={{ x: 5 }}
                          >
                            {topic.hashtag}
                          </motion.h3>
                          
                          <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors duration-200">
                            {topic.description}
                          </p>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{topic.posts} posts</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400 font-medium">{topic.growth}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className={`text-sm font-medium ${getEngagementColor(topic.engagement)}`}>
                                {topic.engagement}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <motion.button 
                          className="p-2 rounded-full hover:bg-gray-800 transition-colors group-hover:bg-gray-700"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToast(createToast.info('Options', 'More options for this topic'));
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show more trends */}
              <motion.button
                className="w-full mt-4 p-3 rounded-xl border border-gray-800 text-yellow-400 hover:bg-gray-900/50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Show more trends
              </motion.button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Who to follow */}
            <motion.div 
              className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-800"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Who to follow</h3>
                <motion.button
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Refresh
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {suggestedUsers.map((user, index) => (
                  <motion.div 
                    key={user.id} 
                    className="group p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <motion.div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getInitials(user.username)}
                        </motion.div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="font-medium text-white truncate group-hover:text-yellow-300 transition-colors">
                              {user.username}
                            </span>
                            {user.isVerified && (
                              <motion.div 
                                className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.2 }}
                              >
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                            <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full">
                              {user.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-400 text-sm truncate mb-1">{user.handle}</p>
                          <p className="text-gray-500 text-xs truncate mb-2">{user.bio}</p>
                          
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{user.followers}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span className={getEngagementColor(user.engagement)}>{user.engagement}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{user.lastActive}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <AnimatedButton
                        onClick={() => handleFollowUser()}
                        variant="secondary"
                        size="sm"
                        className="ml-2 px-4 py-1.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-medium"
                      >
                        Follow
                      </AnimatedButton>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button 
                className="w-full mt-4 text-yellow-400 hover:text-yellow-300 hover:underline text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Show more suggestions
              </motion.button>
            </motion.div>

            {/* What's happening widget */}
            <motion.div 
              className="bg-gray-900/50 rounded-xl p-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="font-bold text-lg mb-4">What's happening</h3>
              
              <div className="space-y-4">
                <div className="cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Trending in Technology</span>
                  </div>
                  <p className="font-medium text-white">Decentralized Social Networks</p>
                  <p className="text-sm text-gray-400">42.1K posts</p>
                </div>

                <div className="cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Live event</span>
                  </div>
                  <p className="font-medium text-white">Blockchain Conference 2024</p>
                  <p className="text-sm text-gray-400">Happening now</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Explore; 