import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostWithAuthor } from '../types';
import { X, Repeat2, Quote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedActor } from '../services/actor';
import { useToast, createToast } from './ui/ToastNotification';
import { backdropVariants, slideInVariants } from '../utils/animations';

interface RepostModalProps {
  isOpen: boolean;
  post: PostWithAuthor;
  onClose: () => void;
  onRepostCreated: (newRepost: PostWithAuthor) => void;
}

const RepostModal: React.FC<RepostModalProps> = ({
  isOpen,
  post,
  onClose,
  onRepostCreated,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [comment, setComment] = useState('');
  const [reposting, setReposting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setComment('');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reposting) return;
    
    try {
      setReposting(true);
      const actor = await getAuthenticatedActor();
      
      // Create a repost by creating a new post with repost metadata
      const repostContent = comment.trim() || `Reposted from @${post.author_username}`;
      
      const postData = {
        content: repostContent,
        image_url: undefined, // Reposts don't have their own images
      };
      
      const result = await actor.create_post(postData);
      
      if (result.Ok) {
        // Create the repost object with metadata
        const newRepost: PostWithAuthor = {
          id: result.Ok.id,
          author: user?.id || '',
          author_username: user?.username || '',
          content: repostContent,
          created_at: result.Ok.created_at,
          likes_count: BigInt(0),
          comments_count: BigInt(0),
          liked_by: [],
          is_repost: true,
          original_post_id: post.id,
          original_author: post.author,
          original_author_username: post.author_username,
          repost_comment: comment.trim() || undefined,
        };

        // Store repost metadata in localStorage
        const reposts = JSON.parse(localStorage.getItem('reposts') || '{}');
        reposts[result.Ok.id] = {
          original_post_id: post.id,
          original_author: post.author,
          original_author_username: post.author_username,
          original_content: post.content,
          original_image_url: post.image_url,
          original_created_at: post.created_at,
          repost_comment: comment.trim() || undefined,
        };
        localStorage.setItem('reposts', JSON.stringify(reposts));

        // Update repost tracking for the original post
        const repostTracking = JSON.parse(localStorage.getItem('repostTracking') || '{}');
        if (!repostTracking[post.id]) {
          repostTracking[post.id] = [];
        }
        repostTracking[post.id].push(user?.id || '');
        localStorage.setItem('repostTracking', JSON.stringify(repostTracking));
        
        onRepostCreated(newRepost);
        onClose();
        
        addToast(createToast.success(
          'Reposted!',
          `You reposted ${post.author_username}'s post`
        ));
      } else {
        addToast(createToast.error(
          'Repost failed',
          result.Err || 'Unable to create repost. Please try again.'
        ));
      }
    } catch (error) {
      console.error('Error creating repost:', error);
      addToast(createToast.error(
        'Repost failed',
        'An error occurred while creating the repost.'
      ));
    } finally {
      setReposting(false);
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-hidden"
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <Repeat2 className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Repost
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6 space-y-4">
              {/* User Avatar and Comment Input */}
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                    {getInitials(user?.username || '')}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      autoResizeTextarea();
                    }}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    rows={2}
                    maxLength={280}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.length}/280
                    </span>
                  </div>
                </div>
              </div>

              {/* Original Post Preview */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-start space-x-3">
                  <Quote className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-xs" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                        {getInitials(post.author_username)}
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {post.author_username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        @{post.author_username.toLowerCase()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-3">
                      {post.content}
                    </p>
                    {post.image_url && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.image_url}
                          alt="Original post content"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reposting}
                className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                {reposting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reposting...</span>
                  </>
                ) : (
                  <>
                    <Repeat2 className="h-4 w-4" />
                    <span>Repost</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RepostModal; 