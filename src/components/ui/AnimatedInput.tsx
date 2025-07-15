import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface AnimatedInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  rows = 3,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const labelVariants = {
    default: {
      top: '50%',
      left: '12px',
      fontSize: '16px',
      color: '#9CA3AF',
      transform: 'translateY(-50%)',
    },
    floating: {
      top: '-8px',
      left: '8px',
      fontSize: '12px',
      color: isFocused ? '#06B6D4' : '#6B7280',
      transform: 'translateY(0%)',
    },
  };

  const inputVariants = {
    default: {
      borderColor: error ? '#EF4444' : '#D1D5DB',
      boxShadow: '0 0 0 0px rgba(6, 182, 212, 0)',
    },
    focused: {
      borderColor: error ? '#EF4444' : '#06B6D4',
      boxShadow: error 
        ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
        : '0 0 0 3px rgba(6, 182, 212, 0.1)',
    },
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const inputClasses = `
    w-full px-3 py-3 pr-10
    bg-white dark:bg-gray-800
    border-2 rounded-lg
    text-gray-900 dark:text-white
    placeholder-transparent
    focus:outline-none
    transition-all duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
    ${className}
  `;

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="relative">
      <motion.div
        className="relative"
        whileTap={{ scale: disabled ? 1 : 0.995 }}
      >
        {/* Input field */}
        <motion.div
          variants={inputVariants}
          animate={isFocused ? 'focused' : 'default'}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <InputComponent
            ref={inputRef as any}
            type={getInputType()}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            rows={type === 'textarea' ? rows : undefined}
            placeholder={placeholder}
            className={inputClasses}
          />

          {/* Floating label */}
          <motion.label
            variants={labelVariants}
            animate={isFloating ? 'floating' : 'default'}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="absolute pointer-events-none bg-white dark:bg-gray-800 px-1 z-10"
            htmlFor={inputRef.current?.id}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>

          {/* Password toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              tabIndex={-1}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </motion.div>
            </button>
          )}
        </motion.div>

        {/* Focus ring */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-lg border-2 border-cyan-500 pointer-events-none"
              style={{ 
                boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.1)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character count for textarea */}
      {type === 'textarea' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right"
        >
          {value.length} characters
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedInput; 