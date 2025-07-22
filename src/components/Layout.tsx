import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  User, 
  Moon, 
  Sun, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  MessageCircle,
  Hash,
  Users,
  Scale,
  MoreHorizontal
} from 'lucide-react';
import { 
  slideInVariants, 
  containerVariants, 
  itemVariants, 
  backdropVariants,
  navbarVariants,
  mobileMenuVariants,
  sidebarItemVariants,
  sidebarContainerVariants,
  sidebarLogoVariants,
  navItemHoverVariants
} from '../utils/animations';
import AnimatedButton from './ui/AnimatedButton';
import GlassCard from './ui/GlassCard';
import LoadingSkeleton from './ui/LoadingSkeleton';

const Layout: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Enhanced scroll handling with direction detection and performance optimization
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(currentScrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <ellipse cx="8" cy="12" rx="3" ry="4" transform="rotate(-45 8 12)"/>
              <ellipse cx="16" cy="12" rx="3" ry="4" transform="rotate(-45 16 12)"/>
            </svg>
          </div>
          <LoadingSkeleton variant="text" className="w-32 h-4 mx-auto" />
        </div>
      </motion.div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/', count: null },
    { icon: Hash, label: 'Explore', path: '/explore', count: null },
    { icon: Bell, label: 'Notifications', path: '/notifications', count: 3 },
    { icon: MessageCircle, label: 'Messages', path: '/messages', count: 2 },
    { icon: Users, label: 'Communities', path: '/communities', count: null },
    { icon: Scale, label: 'Governance', path: '/governance', count: null },
    { icon: User, label: 'Profile', path: '/profile', count: null },
    { icon: MoreHorizontal, label: 'More', path: '/more', count: null },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Desktop Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full w-72 bg-black/95 backdrop-blur-xl border-r border-gray-800/30 z-40 hidden lg:block overflow-hidden"
        variants={slideInVariants}
        initial="hidden"
        animate="visible"
        style={{
          boxShadow: '0 0 50px rgba(250, 209, 38, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        
        <motion.div 
          className="flex flex-col h-full px-3 py-4 relative z-10"
          variants={sidebarContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center mb-5"
            variants={sidebarLogoVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="w-8 h-8 rounded-full flex items-center justify-center relative shadow-xl mr-3 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <svg className="w-4 h-4 text-white relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <ellipse cx="8" cy="12" rx="3" ry="4" transform="rotate(-45 8 12)"/>
                  <ellipse cx="16" cy="12" rx="3" ry="4" transform="rotate(-45 16 12)"/>
                </svg>
              </motion.div>
              <motion.h1 
                className="text-lg font-bold bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200"
                style={{ backgroundImage: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                variants={sidebarItemVariants}
              >
                Soclynk
              </motion.h1>
            </Link>
          </motion.div>

          {/* Navigation */}
          <motion.nav 
            className="space-y-1 flex-1 mb-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div key={item.path} variants={sidebarItemVariants}>
                  <motion.div
                    variants={navItemHoverVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to={item.path}
                      className={`group flex items-center space-x-3 px-3 py-2.5 rounded-full transition-all duration-300 hover:bg-gray-900/50 relative overflow-hidden ${
                        isActive 
                          ? 'text-white font-bold' 
                          : 'text-gray-300'
                      }`}
                      style={isActive ? { 
                        background: 'linear-gradient(135deg, rgba(250, 209, 38, 0.15), rgba(255, 86, 78, 0.1))',
                        boxShadow: '0 0 20px rgba(250, 209, 38, 0.2)'
                      } : {}}
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <motion.div
                        className="relative z-10"
                        whileHover={{ scale: 1.1, rotate: isActive ? 5 : 0 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={`w-5 h-5 transition-colors duration-200 ${
                          isActive ? 'text-yellow-400' : 'text-gray-300 group-hover:text-yellow-400'
                        }`} />
                        {item.count && item.count > 0 && (
                          <motion.div 
                            className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                          >
                            {item.count}
                          </motion.div>
                        )}
                      </motion.div>
                      <span className="text-lg hidden lg:block relative z-10 group-hover:text-yellow-300 transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* Theme Toggle */}
          <motion.div 
            className="mb-4"
            variants={sidebarItemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="flex items-center justify-between px-3 py-2.5 rounded-full hover:bg-gray-900/50 transition-all duration-300 relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTheme}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center space-x-3 relative z-10">
                <motion.div 
                  className="w-5 h-5 flex items-center justify-center"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <Moon className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors duration-200" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400 group-hover:text-orange-400 transition-colors duration-200" />
                  )}
                </motion.div>
                <span className="text-lg text-gray-300 hidden lg:block group-hover:text-yellow-300 transition-colors duration-200">
                  Display
                </span>
              </div>
              <motion.button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black shadow-inner ${
                  isDark ? 'bg-gray-700' : 'bg-yellow-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                  animate={{
                    x: isDark ? 24 : 4,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                  }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* User Profile Section */}
          <motion.div 
            className="mt-auto"
            variants={sidebarItemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="p-2.5 rounded-full hover:bg-gray-900/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <motion.div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-md text-xs"
                    style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user?.username ? getInitials(user.username) : 'U'}
                  </motion.div>
                  <div className="hidden lg:block min-w-0 flex-1">
                    <div className="font-bold text-white text-sm truncate">
                      {user?.username || 'Unknown User'}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      @{user?.username?.toLowerCase() || 'unknown'}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* Mobile Header */}
      <motion.header
        className="lg:hidden fixed top-0 left-0 right-0 z-50"
        variants={navbarVariants}
        animate={scrolled ? "scrolled" : "top"}
        initial={{ y: -100 }}
        style={{
          backgroundColor: scrolled 
            ? "rgba(0, 0, 0, 0.95)" 
            : "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <ellipse cx="8" cy="12" rx="3" ry="4" transform="rotate(-45 8 12)"/>
                <ellipse cx="16" cy="12" rx="3" ry="4" transform="rotate(-45 16 12)"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
              Soclynk
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton
              onClick={() => {/* Search functionality */}}
              variant="ghost"
              size="sm"
              className="lg:hidden"
            >
              <Search className="w-5 h-5" />
            </AnimatedButton>
            
            <AnimatedButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </AnimatedButton>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="fixed top-16 left-4 right-4 z-50 lg:hidden"
              variants={slideInVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <GlassCard intensity="strong" className="border-white/20 dark:border-gray-700/30 shadow-2xl bg-black/95">
                <motion.div 
                  className="p-6"
                  variants={mobileMenuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <motion.nav 
                    className="space-y-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <motion.div
                          key={item.path}
                          variants={itemVariants}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            to={item.path}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive 
                                ? 'text-white' 
                                : 'text-gray-300 hover:bg-gray-800/50'
                            }`}
                            style={isActive ? { background: 'linear-gradient(135deg, #FAD126, #FF564E)' } : {}}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="relative">
                              <Icon className="w-6 h-6" />
                              {item.count && item.count > 0 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                  {item.count}
                                </div>
                              )}
                            </div>
                            <span className="text-lg font-medium">{item.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  
                    <motion.div className="border-t border-gray-700 pt-4 mt-4">
                      <button
                        onClick={toggleTheme}
                        className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800/50 transition-all duration-200 w-full"
                      >
                        {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        <span className="text-lg font-medium">
                          {isDark ? 'Dark mode' : 'Light mode'}
                        </span>
                      </button>
                    </motion.div>
                  
                    <motion.div className="border-t border-gray-700 pt-4 mt-4">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-all duration-200 w-full"
                      >
                        <LogOut className="w-6 h-6" />
                        <span className="text-lg font-medium">Log out</span>
                      </button>
                    </motion.div>
                  </motion.nav>
                </motion.div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Layout; 