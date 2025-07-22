import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Repeat2, 
  AtSign, 
  Settings,
  CheckCircle,
  X,
  MoreHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { pageVariants, pageTransition, staggerContainer, fadeInUp } from '../utils/animations';
import { useToast, createToast } from '../components/ui/ToastNotification';

const Notifications: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'mentions' | 'likes' | 'follows'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: { name: 'Sarah Chen', handle: '@sarahchen', avatar: 'SC' },
      content: 'liked your post about "Building the future with Web3"',
      timestamp: '2 min ago',
      isRead: false,
      postPreview: 'Building the future with Web3 requires...',
      actionData: { postId: 123 }
    },
    {
      id: 2,
      type: 'follow',
      user: { name: 'Alex Rodriguez', handle: '@alexrod', avatar: 'AR' },
      content: 'started following you',
      timestamp: '5 min ago',
      isRead: false,
      actionData: { userId: 456 }
    },
    {
      id: 3,
      type: 'comment',
      user: { name: 'Michael Park', handle: '@mikepark', avatar: 'MP' },
      content: 'commented on your post: "Great insights! I completely agree with your perspective on decentralized finance."',
      timestamp: '15 min ago',
      isRead: true,
      postPreview: 'DeFi is revolutionizing traditional finance...',
      actionData: { postId: 124, commentId: 789 }
    },
    {
      id: 4,
      type: 'repost',
      user: { name: 'Emma Wilson', handle: '@emmaw', avatar: 'EW' },
      content: 'reposted your content',
      timestamp: '1 hour ago',
      isRead: true,
      postPreview: 'The metaverse is closer than we think...',
      actionData: { postId: 125 }
    },
    {
      id: 5,
      type: 'mention',
      user: { name: 'David Kim', handle: '@davidkim', avatar: 'DK' },
      content: 'mentioned you in a post: "Thanks to @yourhandle for the amazing tutorial on smart contracts!"',
      timestamp: '2 hours ago',
      isRead: false,
      actionData: { postId: 126 }
    },
    {
      id: 6,
      type: 'like',
      user: { name: 'Lisa Zhang', handle: '@lisaz', avatar: 'LZ' },
      content: 'and 12 others liked your comment',
      timestamp: '3 hours ago',
      isRead: true,
      postPreview: 'NFTs are transforming digital ownership...',
      actionData: { commentId: 890, likeCount: 13 }
    },
    {
      id: 7,
      type: 'follow',
      user: { name: 'Ryan Thompson', handle: '@ryant', avatar: 'RT' },
      content: 'started following you',
      timestamp: '5 hours ago',
      isRead: true,
      actionData: { userId: 789 }
    }
  ]);

  const { addToast } = useToast();

  const filters = [
    { id: 'all', label: 'All', icon: Bell, count: notifications.length },
    { id: 'unread', label: 'Unread', icon: Eye, count: notifications.filter(n => !n.isRead).length },
    { id: 'mentions', label: 'Mentions', icon: AtSign, count: notifications.filter(n => n.type === 'mention').length },
    { id: 'likes', label: 'Likes', icon: Heart, count: notifications.filter(n => n.type === 'like').length },
    { id: 'follows', label: 'Follows', icon: UserPlus, count: notifications.filter(n => n.type === 'follow').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.isRead;
      case 'mentions':
        return notification.type === 'mention';
      case 'likes':
        return notification.type === 'like';
      case 'follows':
        return notification.type === 'follow';
      default:
        return true;
    }
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    addToast(createToast.success('Marked as read', 'Notification updated'));
  };

  const markAsUnread = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: false } : notification
      )
    );
    addToast(createToast.info('Marked as unread', 'Notification updated'));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    addToast(createToast.success('Deleted', 'Notification removed'));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    addToast(createToast.success('All read', 'All notifications marked as read'));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return UserPlus;
      case 'repost': return Repeat2;
      case 'mention': return AtSign;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-red-400';
      case 'comment': return 'text-blue-400';
      case 'follow': return 'text-green-400';
      case 'repost': return 'text-purple-400';
      case 'mention': return 'text-yellow-400';
      default: return 'text-gray-400';
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Bell className="w-6 h-6 mr-2 text-yellow-400" />
                Notifications
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="ml-2 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </h1>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
                      <div className="flex space-x-1 bg-gray-900 rounded-full p-1">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-yellow-400 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <Icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                      {filter.count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          activeFilter === filter.id ? 'bg-black/20' : 'bg-gray-700'
                        }`}>
                          {filter.count}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div 
              className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="font-medium text-white mb-3">Notification Settings</h3>
              <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Push notifications</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Email notifications</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Sound notifications</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </label>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Notifications List */}
        <motion.div 
          className="p-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredNotifications.length > 0 ? (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`p-4 border-b border-gray-800/50 hover:bg-gray-900/30 cursor-pointer transition-all duration-200 ${
                    !notification.isRead ? 'bg-gray-900/20 border-l-4 border-l-yellow-400' : ''
                  }`}
                  variants={fadeInUp}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Notification Icon */}
                    <div className="mt-1">
                      {React.createElement(getNotificationIcon(notification.type), {
                        className: `w-5 h-5 ${getNotificationColor(notification.type)}`
                      })}
                    </div>

                    {/* User Avatar */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                    >
                      {notification.user.avatar}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{notification.user.name}</span>
                        {notification.type === 'mention' && (
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <AtSign className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="text-gray-400 text-sm">{notification.timestamp}</span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">
                        {notification.content}
                      </p>

                      {/* Post preview if available */}
                      {notification.postPreview && (
                        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {notification.postPreview}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                      {notification.type === 'follow' && (
                        <button className="px-3 py-1 bg-white text-black rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                          Follow back
                        </button>
                      )}
                      {!notification.isRead && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsUnread(notification.id); }}
                        className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                        className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              variants={fadeInUp}
            >
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No notifications yet</h3>
              <p className="text-gray-500">When someone interacts with your posts, you'll see it here</p>
            </motion.div>
          )}

          {/* Mark all as read button */}
          {notifications.filter(n => !n.isRead).length > 0 && (
            <motion.div 
              className="mt-6 text-center"
              variants={fadeInUp}
            >
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Mark all as read ({notifications.filter(n => !n.isRead).length})
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Notifications; 