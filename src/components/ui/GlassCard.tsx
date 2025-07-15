import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../utils/animations';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  intensity?: 'light' | 'medium' | 'strong';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  intensity = 'medium',
}) => {
  const intensityClasses = {
    light: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm',
    medium: 'bg-white/20 dark:bg-gray-800/20 backdrop-blur-md',
    strong: 'bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg',
  };

  const baseClasses = `
    ${intensityClasses[intensity]}
    border border-white/20 dark:border-gray-700/20
    rounded-xl shadow-xl
    transition-all duration-300
  `;

  const hoverClasses = hoverable 
    ? 'hover:bg-white/30 dark:hover:bg-gray-800/30 hover:shadow-2xl hover:border-white/30 dark:hover:border-gray-600/30 cursor-pointer' 
    : '';

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      variants={hoverable ? cardVariants : undefined}
      initial={hoverable ? "hidden" : undefined}
      animate={hoverable ? "visible" : undefined}
      whileHover={hoverable ? "hover" : undefined}
      layout
    >
      {children}
    </Component>
  );
};

export default GlassCard; 