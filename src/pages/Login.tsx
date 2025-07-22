import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, ArrowRight, Download, Sparkles, Shield, Zap } from 'lucide-react';
import { pageVariants, pageTransition, floatingVariants } from '../utils/animations';
import AnimatedButton from '../components/ui/AnimatedButton';
import GlassCard from '../components/ui/GlassCard';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900/20 dark:to-orange-900/20"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)', opacity: 0.2 }}
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(135deg, #FF564E, #FAD126)', opacity: 0.2 }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl"
          style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)', opacity: 0.3 }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-lg w-full space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Logo and Header */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div 
              className="mx-auto mb-6 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-2xl relative" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <ellipse cx="8" cy="12" rx="4" ry="6" transform="rotate(-45 8 12)"/>
                  <ellipse cx="16" cy="12" rx="4" ry="6" transform="rotate(-45 16 12)"/>
                </svg>
                <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-purple-600"></div>
                
                {/* Floating sparkles */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
              style={{ backgroundImage: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Welcome to Soclynk
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              The future of decentralized social networking on the Internet Computer
            </motion.p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <GlassCard className="p-8" intensity="medium">
              <div className="space-y-6">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}
                  >
                    <Wallet className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Connect Your Wallet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get started with Plug Wallet to join the decentralized social experience
                  </p>
                </div>

                {/* Features */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  {[
                    { icon: Shield, title: 'Secure & Private', desc: 'Your data stays on-chain and under your control' },
                    { icon: Zap, title: 'Lightning Fast', desc: 'Instant interactions powered by Internet Computer' },
                    { icon: Sparkles, title: 'Truly Decentralized', desc: 'No centralized servers, no single point of failure' }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Connect Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <AnimatedButton
                    onClick={handleLogin}
                    disabled={isLoading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isLoading}
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Plug Wallet
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </AnimatedButton>
                </motion.div>

                {/* Download Link */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.6 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Don't have Plug Wallet yet?
                  </p>
                  <motion.a
                    href="https://plugwallet.ooo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download here
                  </motion.a>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Internet Computer • Built with ❤️ for the decentralized web
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login; 