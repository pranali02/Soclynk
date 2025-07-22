import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useToast, createToast } from '../components/ui/ToastNotification';
import { 
  MoreHorizontal,
  Settings,
  HelpCircle,
  Shield,
  BookOpen,
  Zap,
  Palette,
  Globe,
  Download,
  Code,
  Heart,
  Coffee,
  Users,
  TrendingUp,
  BarChart3,
  Bookmark,
  Archive,
  ChevronRight,
  X,
  Moon,
  Sun,
  Monitor,
  Eye,
  UserCheck,
  Search,
  Star
} from 'lucide-react';
import { pageVariants, pageTransition, staggerContainer, fadeInUp } from '../utils/animations';

const More: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [displaySettings, setDisplaySettings] = useState({
    fontSize: 'medium',
    colorScheme: 'auto',
    reducedMotion: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    allowMessages: true,
    allowNotifications: true,
    shareAnalytics: false,
  });

  const menuItems = [
    {
      section: 'Account & Profile',
      items: [
        { 
          icon: Settings, 
          label: 'Settings and privacy', 
          description: 'Manage your account preferences',
          action: () => setActiveModal('settings')
        },
        { 
          icon: Shield, 
          label: 'Privacy and safety', 
          description: 'Control who can see your content',
          action: () => setActiveModal('privacy')
        },
        { 
          icon: Bookmark, 
          label: 'Bookmarks', 
          description: 'Save posts for later',
          action: () => setActiveModal('bookmarks')
        },
        { 
          icon: Archive, 
          label: 'Archive', 
          description: 'View your archived content',
          action: () => setActiveModal('archive')
        }
      ]
    },
    {
      section: 'Creator Tools',
      items: [
        { 
          icon: BarChart3, 
          label: 'Analytics', 
          description: 'View your content performance',
          action: () => setActiveModal('analytics')
        },
        { 
          icon: TrendingUp, 
          label: 'Creator Studio', 
          description: 'Tools for content creators',
          action: () => setActiveModal('creator-studio')
        },
        { 
          icon: Zap, 
          label: 'Professional Tools', 
          description: 'Advanced features for creators',
          action: () => setActiveModal('pro-tools')
        },
        { 
          icon: Users, 
          label: 'Communities', 
          description: 'Manage your communities',
          action: () => addToast(createToast.info('Redirecting...', 'Opening Communities page'))
        }
      ]
    },
    {
      section: 'Resources',
      items: [
        { 
          icon: HelpCircle, 
          label: 'Help Center', 
          description: 'Get support and find answers',
          action: () => setActiveModal('help')
        },
        { 
          icon: BookOpen, 
          label: 'About Soclynk', 
          description: 'Learn about our platform',
          action: () => setActiveModal('about')
        },
        { 
          icon: Code, 
          label: 'Developer Portal', 
          description: 'Build with our APIs',
          action: () => setActiveModal('developer')
        },
        { 
          icon: Globe, 
          label: 'Accessibility', 
          description: 'Tools for better accessibility',
          action: () => setActiveModal('accessibility')
        }
      ]
    },
    {
      section: 'Customization',
      items: [
        { 
          icon: Palette, 
          label: 'Display', 
          description: 'Customize your experience',
          action: () => setActiveModal('display')
        },
        { 
          icon: Download, 
          label: 'Download app', 
          description: 'Get Soclynk on mobile',
          action: () => setActiveModal('download')
        }
      ]
    },
    {
      section: 'Support',
      items: [
        { 
          icon: Heart, 
          label: 'Support Soclynk', 
          description: 'Help us grow the platform',
          action: () => setActiveModal('support')
        },
        { 
          icon: Coffee, 
          label: 'Buy us a coffee', 
          description: 'Support the development team',
          action: () => setActiveModal('coffee')
        }
      ]
    }
  ];

  const closeModal = () => setActiveModal(null);

  const renderModal = () => {
    if (!activeModal) return null;

    const modalProps = {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.2 }
    };

    switch (activeModal) {
      case 'settings':
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Two-factor authentication</div>
                        <div className="text-sm text-gray-500">Add extra security to your account</div>
                      </div>
                      <button className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Email notifications</div>
                        <div className="text-sm text-gray-500">Receive updates via email</div>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Push notifications</div>
                        <div className="text-sm text-gray-500">Get real-time updates</div>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Safety</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'profileVisible', label: 'Profile visible to everyone', desc: 'Allow others to see your profile' },
                    { key: 'allowMessages', label: 'Allow direct messages', desc: 'Receive messages from other users' },
                    { key: 'allowNotifications', label: 'Push notifications', desc: 'Get notifications for interactions' },
                    { key: 'shareAnalytics', label: 'Share analytics data', desc: 'Help improve the platform' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{setting.label}</div>
                        <div className="text-sm text-gray-500">{setting.desc}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={privacySettings[setting.key as keyof typeof privacySettings]}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'display':
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Display Settings</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Theme</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'auto', label: 'Automatic', icon: Monitor }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            if (theme.id !== 'auto') {
                              if ((theme.id === 'dark') !== isDark) {
                                toggleTheme();
                              }
                            }
                            addToast(createToast.success('Theme updated', `Switched to ${theme.label} theme`));
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                            (theme.id === 'dark' && isDark) || (theme.id === 'light' && !isDark)
                              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Font Size</h3>
                  <div className="space-y-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setDisplaySettings(prev => ({ ...prev, fontSize: size }));
                          addToast(createToast.success('Font size updated', `Changed to ${size} size`));
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          displaySettings.fontSize === size
                            ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className={`font-medium ${
                          size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
                        }`}>
                          {size.charAt(0).toUpperCase() + size.slice(1)} - Sample text
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Total Views', value: '45.2K', change: '+12%', icon: Eye },
                    { label: 'Engagement Rate', value: '8.4%', change: '+3.2%', icon: Heart },
                    { label: 'New Followers', value: '234', change: '+18%', icon: UserCheck }
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Performance</h3>
                  <div className="space-y-4">
                    {[
                      { post: 'Web3 Development Tips', views: 2340, likes: 89, comments: 23 },
                      { post: 'DeFi Market Analysis', views: 1850, likes: 67, comments: 31 },
                      { post: 'NFT Collection Showcase', views: 3200, likes: 156, comments: 45 }
                    ].map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{post.post}</div>
                          <div className="text-sm text-gray-500">{post.views} views • {post.likes} likes • {post.comments} comments</div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'help':
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search help articles..."
                      className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Getting Started with Soclynk', desc: 'Learn the basics of our platform' },
                    { title: 'Creating Your First Post', desc: 'Step-by-step guide to posting content' },
                    { title: 'Privacy Settings Explained', desc: 'Understand your privacy options' },
                    { title: 'Connecting Your Wallet', desc: 'How to link your crypto wallet' },
                    { title: 'Community Guidelines', desc: 'Rules and best practices' },
                    { title: 'Troubleshooting Login Issues', desc: 'Common login problems and solutions' }
                  ].map((article, index) => (
                    <button key={index} className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="font-medium text-gray-900 dark:text-white">{article.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{article.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'about':
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Soclynk</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Decentralized Social Networking</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Built on the Internet Computer for true decentralization
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      To create a social platform where users truly own their data and connections, 
                      powered by blockchain technology and decentralized governance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Fully on-chain data storage</li>
                      <li>• Decentralized identity management</li>
                      <li>• Community-driven governance</li>
                      <li>• No ads or data tracking</li>
                      <li>• Interoperable with Web3 ecosystem</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Version:</strong> 1.0.0<br />
                      <strong>Built with:</strong> Internet Computer, React, TypeScript<br />
                      <strong>License:</strong> MIT Open Source
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" {...modalProps}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Feature Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This feature is currently in development and will be available in a future update.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        );
    }
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 p-4 z-10"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-2xl font-bold flex items-center">
            <MoreHorizontal className="w-6 h-6 mr-2 text-yellow-400" />
            More
          </h1>
          <p className="text-gray-400 text-sm mt-1">Additional tools and settings</p>
        </motion.div>

        {/* Menu Items */}
        <motion.div 
          className="p-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {menuItems.map((section, sectionIndex) => (
            <motion.div 
              key={section.section}
              className={`mb-8 ${sectionIndex !== 0 ? 'pt-6 border-t border-gray-800' : ''}`}
              variants={fadeInUp}
            >
              <h2 className="text-lg font-semibold text-white mb-4 px-2">
                {section.section}
              </h2>
              
              <div className="space-y-1">
                {section.items.map((item) => (
                  <motion.button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-900/50 transition-all duration-200 group"
                    variants={fadeInUp}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                        <item.icon className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Footer Section */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-800"
            variants={fadeInUp}
          >
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800">
              <h3 className="font-bold text-lg text-white mb-2">
                Building the Future of Social
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Soclynk is a decentralized social network built on the Internet Computer. 
                We're creating a platform where users own their data and connections.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Version 1.0.0</span>
                <span>•</span>
                <span>Built with ❤️ by the Soclynk team</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="mt-6 grid grid-cols-3 gap-4"
            variants={staggerContainer}
          >
            {[
              { label: 'Active Users', value: '25.4K', icon: Users },
              { label: 'Posts Today', value: '1.2K', icon: TrendingUp },
              { label: 'Communities', value: '156', icon: Globe }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="bg-gray-900/50 rounded-xl p-4 text-center border border-gray-800"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <stat.icon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {renderModal()}
      </AnimatePresence>
    </motion.div>
  );
};

export default More; 