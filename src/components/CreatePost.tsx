import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedActor } from '../services/actor';
import { PostWithAuthor } from '../types';
import { Image as ImageIcon, X, Camera, Smile, MapPin, Gift } from 'lucide-react';
// Removed mock post import - now using only blockchain storage
import { fadeInUp } from '../utils/animations';
import { useToast, createToast } from './ui/ToastNotification';

interface CreatePostProps {
  onPostCreated: (newPost: PostWithAuthor) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [posting, setPosting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [, setUploadedFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast(createToast.error('Invalid file type', 'Please select an image file'));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      addToast(createToast.error('File too large', 'Image size must be less than 5MB'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setUploadedFileName(file.name);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedFileName('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    autoResizeTextarea();
  };

  const handlePost = async () => {
    if (!content.trim() || posting) return;
    
    // 1. Check if Plug Wallet is connected
    if (!window.ic?.plug) {
      addToast(createToast.error('Plug Wallet required', 'Please install Plug Wallet to create posts'));
      return;
    }
    
    // 2. Check if Plug is connected
    const isConnected = await window.ic.plug.isConnected();
    if (!isConnected) {
      addToast(createToast.error('Not connected', 'Please connect your Plug Wallet first'));
      return;
    }
    
    // 3. Check if agent is available
    if (!window.ic.plug.agent) {
      addToast(createToast.error('Authentication failed', 'Plug Wallet agent not available. Please reconnect.'));
      return;
    }
    
    // 4. Get principal and verify authentication
    let principal;
    try {
      principal = await window.ic.plug.getPrincipal();
      if (!principal) {
        addToast(createToast.error('Authentication failed', 'Unable to get user principal. Please reconnect Plug Wallet.'));
        return;
      }
    } catch (error) {
      addToast(createToast.error('Authentication failed', 'Failed to get principal from Plug Wallet'));
      return;
    }
    
    // 5. Check if user has a profile
    if (!user?.username) {
      addToast(createToast.error('Profile required', 'Please create a profile before posting'));
      return;
    }
    
    // 6. Verify canister is whitelisted
    const canisterId = 'vizcg-th777-77774-qaaea-cai';
    try {
      const whitelistedCanisters = await window.ic.plug.requestConnect({
        whitelist: [canisterId],
        host: window.location.hostname === 'localhost' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
      });
      
      if (!whitelistedCanisters) {
        addToast(createToast.error('Authorization failed', 'Please authorize the onchain360_backend canister'));
        return;
      }
    } catch (error) {
      addToast(createToast.error('Authorization failed', 'Failed to authorize canister access'));
      return;
    }
    
    setPosting(true);
    
    try {
      console.log('Creating post on onchain360_backend for principal:', principal.toString());
      console.log('User:', user.username);
      
      const actor = await getAuthenticatedActor();
      
      // Verify actor is properly initialized
      if (!actor) {
        throw new Error('Failed to initialize backend actor');
      }
      
      // Prepare post data for backend
      const postData = {
        content: content.trim(),
        image_url: uploadedImage || imageUrl.trim() || undefined,
      };
      
      console.log('Calling create_post with data:', postData);
      const result = await actor.create_post(postData);
      console.log('Backend response:', result);
      
      if (result.Ok) {
        // Map backend response to frontend format with proper type conversion
        const backendPost = result.Ok;
        const newPost: PostWithAuthor = {
          id: backendPost.id.toString(),
          author: backendPost.author.toString(),
          author_username: user?.username || 'Unknown',
          content: backendPost.content,
          image_url: backendPost.image_url?.[0] || undefined,
          created_at: BigInt(backendPost.created_at), // Ensure bigint type
          likes_count: BigInt(backendPost.likes_count), // Keep as bigint to match type definition
          comments_count: BigInt(backendPost.comments_count), // Keep as bigint to match type definition
          liked_by: backendPost.liked_by?.map((p: any) => p.toString()) || [],
        };
        
        console.log('Post created successfully on blockchain:', newPost);
        
        // Reset form first
        setContent('');
        setImageUrl('');
        setUploadedImage(null);
        setUploadedFileName('');
        setShowImageInput(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        
        // Notify parent to refresh feed from backend
        onPostCreated(newPost);
        
        addToast(createToast.success('Post created on blockchain!', `Post stored permanently on-chain with ID: ${newPost.id}`));
      } else {
        console.error('Backend returned error:', result.Err);
        addToast(createToast.error('Failed to create post', result.Err || 'Unknown backend error'));
      }
    } catch (error) {
      console.error('Error creating post on backend:', error);
      
      // Check specific error types for better user guidance
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
        addToast(createToast.error('Backend connection failed', 'Unable to connect to the onchain360_backend canister. Please ensure dfx is running and the backend is deployed.'));
      } else if (errorMessage.includes('not authenticated') || errorMessage.includes('unauthorized') || errorMessage.includes('agent')) {
        addToast(createToast.error('Authentication failed', 'Please reconnect your Plug Wallet and ensure the canister is authorized.'));
      } else if (errorMessage.includes('canister') || errorMessage.includes('call failed')) {
        addToast(createToast.error('Canister error', 'The backend canister is not responding. Please check the deployment status.'));
      } else if (errorMessage.includes('User not found')) {
        addToast(createToast.error('Profile required', 'Please create a user profile before posting.'));
      } else {
        addToast(createToast.error('Failed to create post', 'An unexpected error occurred. Please try again.'));
      }
    } finally {
      setPosting(false);
    }
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const remainingChars = 280 - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20;

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800"
    >
      <div className="px-4 py-3">
        <form onSubmit={(e) => { e.preventDefault(); handlePost(); }}>
          <div className="flex space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                {user?.username ? getInitials(user.username) : 'U'}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Textarea */}
              <div className="mb-3">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="What's happening?"
                  className="w-full text-[20px] leading-[24px] placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-white border-none resize-none focus:outline-none"
                  rows={1}
                  style={{ minHeight: '24px', maxHeight: '200px' }}
                  maxLength={280}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                />
              </div>

              {/* Image Preview */}
              <AnimatePresence>
                {(uploadedImage || imageUrl) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 relative"
                  >
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={uploadedImage || imageUrl}
                        alt="Upload preview"
                        className="w-full h-auto max-h-80 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          addToast(createToast.error('Failed to load image', 'Please check the image URL'));
                        }}
                      />
                      <motion.button
                        type="button"
                        onClick={removeUploadedImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* URL Input */}
              <AnimatePresence>
                {showImageInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3"
                  >
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-[15px] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drag overlay */}
              <AnimatePresence>
                {dragActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center z-10"
                  >
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-500 font-medium">Drop image here</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
                  {/* Image upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ImageIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-blue-500 group-hover:text-blue-600 transition-colors duration-200" />
                  </motion.button>

                  {/* URL input toggle */}
                  <motion.button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className={`group w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-colors duration-200 ${
                      showImageInput 
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600' 
                        : 'hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xs sm:text-[14px] font-bold">URL</span>
                  </motion.button>

                  {/* GIF button - responsive visibility */}
                  <motion.button
                    type="button"
                    disabled
                    className="group w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full opacity-50 cursor-not-allowed hidden xs:flex"
                    title="GIF (Coming Soon)"
                  >
                    <Gift className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-blue-500" />
                  </motion.button>

                  {/* Emoji button */}
                  <motion.button
                    type="button"
                    disabled
                    className="group w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full opacity-50 cursor-not-allowed"
                    title="Emoji (Coming Soon)"
                  >
                    <Smile className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-blue-500" />
                  </motion.button>

                  {/* Location button - hide on small screens */}
                  <motion.button
                    type="button"
                    disabled
                    className="group w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full opacity-50 cursor-not-allowed hidden sm:flex"
                    title="Location (Coming Soon)"
                  >
                    <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-blue-500" />
                  </motion.button>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Character count */}
                  {content.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="relative w-5 h-5">
                        <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 20 20">
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 8}`}
                            strokeDashoffset={`${2 * Math.PI * 8 * (1 - content.length / 280)}`}
                            className={`transition-all duration-200 ${
                              isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-blue-500'
                            }`}
                          />
                        </svg>
                      </div>
                      {isNearLimit && (
                        <span className={`text-[13px] tabular-nums ${
                          isOverLimit ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                          {remainingChars}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  {content.length > 0 && (
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                  )}

                  {/* Post button */}
                  <motion.button
                    type="submit"
                    disabled={!content.trim() || posting || isOverLimit}
                    className={`px-4 py-1.5 rounded-full font-bold text-[15px] transition-all duration-200 ${
                      !content.trim() || posting || isOverLimit
                        ? 'bg-blue-400 dark:bg-blue-600 text-white cursor-not-allowed opacity-50'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
                    }`}
                    whileHover={!content.trim() || posting || isOverLimit ? {} : { scale: 1.02 }}
                    whileTap={!content.trim() || posting || isOverLimit ? {} : { scale: 0.98 }}
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost; 