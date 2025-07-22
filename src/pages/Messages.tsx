import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MoreHorizontal, 
  Send, 
  Smile, 
  Image, 
  Check, 
  CheckCheck,
  Settings,
  MessageCircle
} from 'lucide-react';
import { pageVariants, pageTransition, staggerContainer, fadeInUp } from '../utils/animations';
import { useToast, createToast } from '../components/ui/ToastNotification';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  reactions?: string[];
}

interface Conversation {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
  lastSeen?: Date;
}

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  // Enhanced conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      username: 'alice_dev',
      displayName: 'Alice Cooper',
      avatar: 'AC',
      lastMessage: 'Hey! How are you doing today?',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      online: true,
      typing: false
    },
    {
      id: '2',
      username: 'bob_crypto',
      displayName: 'Bob Johnson',
      avatar: 'BJ',
      lastMessage: 'The new update looks amazing! 🚀',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 0,
      online: false,
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      typing: false
    },
    {
      id: '3',
      username: 'charlie_web3',
      displayName: 'Charlie Smith',
      avatar: 'CS',
      lastMessage: 'Thanks for the help with the smart contract',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 1,
      online: true,
      typing: true
    },
    {
      id: '4',
      username: 'diana_design',
      displayName: 'Diana Rodriguez',
      avatar: 'DR',
      lastMessage: 'Can you review my latest designs?',
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 0,
      online: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      typing: false
    },
    {
      id: '5',
      username: 'eve_trader',
      displayName: 'Eve Wilson',
      avatar: 'EW',
      lastMessage: 'The market is looking bullish today!',
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unreadCount: 3,
      online: true,
      typing: false
    }
  ]);

  // Enhanced messages data
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    '1': [
      {
        id: '1',
        content: 'Hey! How are you doing today?',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        content: 'I\'m doing great! Just working on some new features for Soclynk 🚀',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        isMe: true,
        status: 'delivered',
        type: 'text',
        reactions: ['👍', '🔥']
      },
      {
        id: '3',
        content: 'That sounds exciting! What kind of features?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: '4',
        content: 'We\'re adding real-time messaging, better notifications, and some amazing animations! The user experience is going to be incredible.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isMe: true,
        status: 'read',
        type: 'text'
      }
    ],
    '2': [
      {
        id: '1',
        content: 'The new update looks amazing! 🚀',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isMe: false,
        status: 'read',
        type: 'text',
        reactions: ['🚀', '❤️']
      }
    ],
    '3': [
      {
        id: '1',
        content: 'Thanks for the help with the smart contract',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isMe: false,
        status: 'read',
        type: 'text'
      }
    ]
  });



  // Simulate typing indicator
  useEffect(() => {
    let typingTimer: number;
    if (isTyping) {
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
    return () => clearTimeout(typingTimer);
  }, [isTyping]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // Handle typing indicator for input
  useEffect(() => {
    if (newMessage.length > 0) {
      setIsTyping(true);
    }
  }, [newMessage]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      isMe: true,
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message]
    }));

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date() }
          : conv
      )
    );

    setNewMessage('');
    setIsTyping(false);
    addToast(createToast.success('Message sent!', 'Your message was delivered'));

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(msg => 
          msg.id === message.id ? { ...msg, status: 'read' } : msg
        )
      }));
    }, 2000);
  };



  const filteredConversations = conversations.filter(conversation =>
    conversation.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };



  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <motion.div
      className="h-screen bg-black text-white flex"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      {/* Left Pane - Conversations List */}
      <div className={`w-full md:w-80 border-r border-gray-800 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <motion.div 
          className="p-4 border-b border-gray-800"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Direct Messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-gray-800"
            />
          </div>
        </motion.div>

        {/* Conversations List */}
        <motion.div 
          className="flex-1 overflow-y-auto messages-container"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-b border-gray-800/50 hover:bg-gray-900/50 ${
                selectedConversation === conversation.id ? 'bg-gray-900 border-l-4 border-yellow-400' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
              variants={fadeInUp}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium mr-3"
                  style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                >
                  {getInitials(conversation.username)}
                </div>
                {conversation.online && (
                  <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-black online-indicator"></div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white truncate">{conversation.username}</span>
                  <span className="text-xs text-gray-400">{formatTime(conversation.lastMessageTime)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right Pane - Chat Interface */}
      <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <motion.div 
              className="p-4 border-b border-gray-800 flex items-center justify-between"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center">
                <button 
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors md:hidden mr-2"
                  onClick={() => setSelectedConversation(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3"
                  style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                >
                  {selectedConv && getInitials(selectedConv.username)}
                </div>
                <div>
                  <h2 className="font-medium text-white">{selectedConv?.username}</h2>
                  <p className="text-xs text-gray-400">
                    {selectedConv?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Messages Area */}
            <motion.div 
              className="flex-1 overflow-y-auto p-4 space-y-4 messages-container"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {currentMessages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.isMe ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 chat-bubble ${
                        message.isMe
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm md:text-base">{message.content}</p>
                    </div>
                    <div className={`flex items-center mt-1 space-x-1 ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-400">{formatMessageTime(message.timestamp)}</span>
                      {message.isMe && (
                        <div className={`message-status ${
                          message.status === 'read' ? 'message-read' : 
                          message.status === 'delivered' ? 'message-delivered' : 'message-sent'
                        }`}>
                          {message.status === 'sent' && <Check className="w-3 h-3" />}
                          {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                          {message.status === 'read' && <CheckCheck className="w-3 h-3" />}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Message Input */}
            <motion.div 
              className="p-4 border-t border-gray-800"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center space-x-2 md:space-x-3 bg-gray-900 rounded-full px-3 md:px-4 py-2">
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Image className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Start a new message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm md:text-base message-input"
                />
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Smile className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </motion.div>
          </>
        ) : (
          /* No Conversation Selected */
          <motion.div 
            className="flex-1 flex items-center justify-center p-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Messages</h2>
              <p className="text-gray-400 text-sm md:text-base">Send private messages to a friend or group.</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Messages; 