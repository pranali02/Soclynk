import React from 'react';
import { motion } from 'framer-motion';
import { shimmerVariants } from '../../utils/animations';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'post' | 'button';
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text',
  lines = 1,
}) => {

  const variants = {
    text: (
      <motion.div
        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        style={{
          background: `linear-gradient(90deg, 
            rgb(229 231 235) 25%, 
            rgb(209 213 219) 50%, 
            rgb(229 231 235) 75%)`,
          backgroundSize: '200% 100%',
        }}
        variants={shimmerVariants}
        animate="animate"
      />
    ),
    avatar: (
      <motion.div
        className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full ${className}`}
        style={{
          background: `linear-gradient(90deg, 
            rgb(229 231 235) 25%, 
            rgb(209 213 219) 50%, 
            rgb(229 231 235) 75%)`,
          backgroundSize: '200% 100%',
        }}
        variants={shimmerVariants}
        animate="animate"
      />
    ),
    button: (
      <motion.div
        className={`h-10 bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
        style={{
          background: `linear-gradient(90deg, 
            rgb(229 231 235) 25%, 
            rgb(209 213 219) 50%, 
            rgb(229 231 235) 75%)`,
          backgroundSize: '200% 100%',
        }}
        variants={shimmerVariants}
        animate="animate"
      />
    ),
    card: (
      <motion.div
        className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"
            style={{
              background: `linear-gradient(90deg, 
                rgb(229 231 235) 25%, 
                rgb(209 213 219) 50%, 
                rgb(229 231 235) 75%)`,
              backgroundSize: '200% 100%',
            }}
            variants={shimmerVariants}
            animate="animate"
          />
          <div className="flex-1 space-y-2">
            <motion.div
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"
              style={{
                background: `linear-gradient(90deg, 
                  rgb(229 231 235) 25%, 
                  rgb(209 213 219) 50%, 
                  rgb(229 231 235) 75%)`,
                backgroundSize: '200% 100%',
              }}
              variants={shimmerVariants}
              animate="animate"
            />
            <motion.div
              className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"
              style={{
                background: `linear-gradient(90deg, 
                  rgb(229 231 235) 25%, 
                  rgb(209 213 219) 50%, 
                  rgb(229 231 235) 75%)`,
                backgroundSize: '200% 100%',
              }}
              variants={shimmerVariants}
              animate="animate"
            />
          </div>
        </div>
        <div className="space-y-2">
          <motion.div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
            style={{
              background: `linear-gradient(90deg, 
                rgb(229 231 235) 25%, 
                rgb(209 213 219) 50%, 
                rgb(229 231 235) 75%)`,
              backgroundSize: '200% 100%',
            }}
            variants={shimmerVariants}
            animate="animate"
          />
          <motion.div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"
            style={{
              background: `linear-gradient(90deg, 
                rgb(229 231 235) 25%, 
                rgb(209 213 219) 50%, 
                rgb(229 231 235) 75%)`,
              backgroundSize: '200% 100%',
            }}
            variants={shimmerVariants}
            animate="animate"
          />
        </div>
      </motion.div>
    ),
    post: (
      <motion.div
        className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex space-x-3">
          <motion.div
            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"
            style={{
              background: `linear-gradient(90deg, 
                rgb(229 231 235) 25%, 
                rgb(209 213 219) 50%, 
                rgb(229 231 235) 75%)`,
              backgroundSize: '200% 100%',
            }}
            variants={shimmerVariants}
            animate="animate"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <motion.div
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"
                style={{
                  background: `linear-gradient(90deg, 
                    rgb(229 231 235) 25%, 
                    rgb(209 213 219) 50%, 
                    rgb(229 231 235) 75%)`,
                  backgroundSize: '200% 100%',
                }}
                variants={shimmerVariants}
                animate="animate"
              />
              <motion.div
                className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"
                style={{
                  background: `linear-gradient(90deg, 
                    rgb(229 231 235) 25%, 
                    rgb(209 213 219) 50%, 
                    rgb(229 231 235) 75%)`,
                  backgroundSize: '200% 100%',
                }}
                variants={shimmerVariants}
                animate="animate"
              />
            </div>
            <div className="space-y-2">
              <motion.div
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                style={{
                  background: `linear-gradient(90deg, 
                    rgb(229 231 235) 25%, 
                    rgb(209 213 219) 50%, 
                    rgb(229 231 235) 75%)`,
                  backgroundSize: '200% 100%',
                }}
                variants={shimmerVariants}
                animate="animate"
              />
              <motion.div
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"
                style={{
                  background: `linear-gradient(90deg, 
                    rgb(229 231 235) 25%, 
                    rgb(209 213 219) 50%, 
                    rgb(229 231 235) 75%)`,
                  backgroundSize: '200% 100%',
                }}
                variants={shimmerVariants}
                animate="animate"
              />
            </div>
            <div className="flex items-center space-x-6 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8"
                  style={{
                    background: `linear-gradient(90deg, 
                      rgb(229 231 235) 25%, 
                      rgb(209 213 219) 50%, 
                      rgb(229 231 235) 75%)`,
                    backgroundSize: '200% 100%',
                  }}
                  variants={shimmerVariants}
                  animate="animate"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    ),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={{
              background: `linear-gradient(90deg, 
                rgb(229 231 235) 25%, 
                rgb(209 213 219) 50%, 
                rgb(229 231 235) 75%)`,
              backgroundSize: '200% 100%',
            }}
            variants={shimmerVariants}
            animate="animate"
          />
        ))}
      </div>
    );
  }

  return variants[variant];
};

export default LoadingSkeleton; 