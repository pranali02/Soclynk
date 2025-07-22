import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedActor } from '../services/actor';
import { PostWithAuthor } from '../types';
import { Heart, MessageCircle, Trash2, MoreHorizontal, Share, Repeat2, Link, Edit3, Clock, Flag } from 'lucide-react';
import CommentModal from './CommentModal';
import EditPostModal from './EditPostModal';
import RepostModal from './RepostModal';
import CreateProposalModal from './CreateProposalModal';
import { 
  cardVariants, 
  slideInVariants, 

  backdropVariants 
} from '../utils/animations';
import { useToast, createToast } from './ui/ToastNotification';

interface PostCardProps {
  post: PostWithAuthor;
  onPostDeleted: (postId: string) => void;
  onPostLiked: (updatedPost: PostWithAuthor) => void;
  onPostEdit?: (updatedPost: PostWithAuthor) => void;
  onRepostCreated?: (newRepost: PostWithAuthor) => void;
  showAuthor?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostDeleted,
  onPostLiked,
  onPostEdit,
  onRepostCreated,
  showAuthor = true,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [currentPost, setCurrentPost] = useState<PostWithAuthor>(post);
  const [showMenu, setShowMenu] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [originalPostData, setOriginalPostData] = useState<any>(null);

  // Load stored data on component mount
  useEffect(() => {
    // Check for edited posts
    const editedPosts = JSON.parse(localStorage.getItem('editedPosts') || '{}');
    if (editedPosts[post.id]) {
      setCurrentPost({
        ...post,
        content: editedPosts[post.id].content,
        image_url: editedPosts[post.id].image_url,
      });
    }

    // Check if this is a repost and load original post data
    if (post.is_repost) {
      const reposts = JSON.parse(localStorage.getItem('reposts') || '{}');
      if (reposts[post.id]) {
        setOriginalPostData(reposts[post.id]);
      }
    }

    // Check repost status for this post
    const repostTracking = JSON.parse(localStorage.getItem('repostTracking') || '{}');
    if (repostTracking[post.id]) {
      setRepostCount(repostTracking[post.id].length);
      setReposted(repostTracking[post.id].includes(user?.id || ''));
    }
  }, [post.id, user?.id]);

  // Update current post when prop changes
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

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

  const handleLike = async () => {
    if (liking) return;
    
    try {
      setLiking(true);
      const actor = await getAuthenticatedActor();
      const result = await actor.like_post(post.id);
      
      if (result.Ok) {
        const updatedPost: PostWithAuthor = {
          ...post,
          likes_count: result.Ok.likes_count,
          liked_by: result.Ok.liked_by.map((p: any) => p.toString()),
          author_username: post.author_username,
        };
        onPostLiked(updatedPost);
        
        const isLiked = updatedPost.liked_by.includes(user?.id || '');
        addToast(createToast.success(
          isLiked ? 'Post liked!' : 'Post unliked',
          `You ${isLiked ? 'liked' : 'unliked'} ${post.author_username}'s post`
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      const isLiked = post.liked_by.includes(user?.id || '');
      const newLikesCount = isLiked ? 
        Math.max(0, Number(post.likes_count) - 1) : 
        Number(post.likes_count) + 1;
      const newLikedBy = isLiked ? 
        post.liked_by.filter(id => id !== user?.id) : 
        [...post.liked_by, user?.id || ''];
      
      const updatedPost: PostWithAuthor = {
        ...post,
        likes_count: BigInt(newLikesCount),
        liked_by: newLikedBy,
      };
      onPostLiked(updatedPost);
      
      addToast(createToast.success(
        'Post liked!',
        'Your interaction was saved successfully'
      ));
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    
    try {
      setDeleting(true);
      const actor = await getAuthenticatedActor();
      const result = await actor.delete_post(post.id);
      
      if (result.Ok) {
        onPostDeleted(post.id);
        addToast(createToast.success(
          'Post deleted',
          'Your post has been successfully removed'
        ));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      onPostDeleted(post.id);
      addToast(createToast.success(
        'Post deleted',
        'Your post has been successfully removed'
      ));
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handlePostUpdated = (updatedPost: PostWithAuthor) => {
    setCurrentPost(updatedPost);
    if (onPostEdit) {
      onPostEdit(updatedPost);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowShareMenu(false);
      
      addToast(createToast.success(
        'Link copied!',
        'Post link has been copied to your clipboard'
      ));
    } catch (error) {
      console.error('Failed to copy link:', error);
      addToast(createToast.error(
        'Failed to copy link',
        'Unable to copy to clipboard. Please try again.'
      ));
    }
  };

  const handleRepost = () => {
    if (reposted) {
      // If already reposted, toggle off (you could implement unrepost here)
      setReposted(false);
      setRepostCount(prev => Math.max(0, prev - 1));
      
      // Remove from localStorage
      const repostTracking = JSON.parse(localStorage.getItem('repostTracking') || '{}');
      if (repostTracking[currentPost.id]) {
        repostTracking[currentPost.id] = repostTracking[currentPost.id].filter((id: string) => id !== user?.id);
        localStorage.setItem('repostTracking', JSON.stringify(repostTracking));
      }
      
      addToast(createToast.info('Repost removed', 'You unreposted this post'));
    } else {
      // Show repost modal
      setShowRepostModal(true);
    }
  };

  const handleRepostCreated = (newRepost: PostWithAuthor) => {
    setReposted(true);
    setRepostCount(prev => prev + 1);
    if (onRepostCreated) {
      onRepostCreated(newRepost);
    }
  };

  const handleReportPost = () => {
    setShowReportModal(true);
    setShowMenu(false);
  };

  const handleProposalCreated = () => {
    addToast(createToast.success(
      'Moderation proposal created!',
      'The community will vote on this report'
    ));
  };

  const isLiked = currentPost.liked_by.includes(user?.id || '');
  const isOwnPost = currentPost.author === user?.id;
  
  // For repost display
  const displayPost = currentPost.is_repost && originalPostData ? {
    ...currentPost,
    content: originalPostData.original_content,
    image_url: originalPostData.original_image_url,
    author_username: originalPostData.original_author_username,
    created_at: originalPostData.original_created_at,
  } : currentPost;

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
    >
      <div className="px-4 py-3">
        {/* Repost Header */}
        {currentPost.is_repost && (
          <div className="flex items-center space-x-2 mb-2 text-gray-500 dark:text-gray-400">
            <Repeat2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              {currentPost.author_username} reposted
            </span>
            {currentPost.repost_comment && (
              <span className="text-sm">• "{currentPost.repost_comment}"</span>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex space-x-3">
          {/* Avatar */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
              {getInitials(displayPost.author_username)}
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* User info with enhanced timestamp */}
            <div className="flex items-center space-x-1 mb-1">
              <span className="font-bold text-gray-900 dark:text-white text-[15px] truncate">
                {showAuthor && displayPost.author_username ? displayPost.author_username : 'Anonymous'}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[15px]">
                @{showAuthor && displayPost.author_username ? displayPost.author_username.toLowerCase() : 'anonymous'}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[15px]">·</span>
              <div 
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-[15px] hover:text-blue-500 transition-colors cursor-pointer group"
                title={new Date(Number(displayPost.created_at) / 1000000).toLocaleString()}
              >
                <Clock className="h-3 w-3 group-hover:text-blue-500" />
                <span className="group-hover:text-blue-500">
                  {formatDate(displayPost.created_at)}
                </span>
              </div>
            </div>

            {/* Post content */}
            <div className="text-gray-900 dark:text-white text-[15px] leading-[20px] mb-3">
              {displayPost.content}
            </div>

            {/* Image */}
            {displayPost.image_url && (
              <motion.div 
                className="mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={displayPost.image_url}
                  alt="Post content"
                  className="w-full h-auto object-cover max-h-96"
                  loading="lazy"
                />
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between max-w-md mt-2">
              {/* Reply */}
              <motion.button
                onClick={() => setShowCommentModal(true)}
                className="group flex items-center space-x-2 p-2 -m-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <MessageCircle className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                </div>
                <span className="text-[13px] text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200 tabular-nums">
                  {Number(currentPost.comments_count)}
                </span>
              </motion.button>

              {/* Retweet */}
              <motion.button
                onClick={handleRepost}
                className={`group flex items-center space-x-2 p-2 -m-2 rounded-full transition-colors duration-200 ${
                  reposted 
                    ? 'hover:bg-green-50 dark:hover:bg-green-950/50' 
                    : 'hover:bg-green-50 dark:hover:bg-green-950/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <Repeat2 className={`w-[18px] h-[18px] transition-colors duration-200 ${
                    reposted 
                      ? 'text-green-500' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-green-500'
                  }`} />
                </div>
                <span className={`text-[13px] transition-colors duration-200 tabular-nums ${
                  reposted 
                    ? 'text-green-500' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-green-500'
                }`}>
                  {repostCount}
                </span>
              </motion.button>

              {/* Like */}
              <motion.button
                onClick={handleLike}
                disabled={liking}
                className={`group flex items-center space-x-2 p-2 -m-2 rounded-full transition-colors duration-200 ${
                  isLiked 
                    ? 'hover:bg-red-50 dark:hover:bg-red-950/50' 
                    : 'hover:bg-red-50 dark:hover:bg-red-950/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-[18px] h-[18px] flex items-center justify-center"
                  animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-[18px] h-[18px] transition-colors duration-200 ${
                    isLiked 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
                  }`} />
                </motion.div>
                <span className={`text-[13px] transition-colors duration-200 tabular-nums ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
                }`}>
                  {liking ? '...' : Number(currentPost.likes_count)}
                </span>
              </motion.button>

              {/* Share */}
              <div className="relative">
                <motion.button
                  onClick={handleShare}
                  className="group flex items-center space-x-2 p-2 -m-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <Share className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                </motion.button>

                {/* Share Menu */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      className="absolute right-0 bottom-full mb-2 w-40 z-30"
                      variants={slideInVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
                        <motion.button
                          onClick={handleCopyLink}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                          whileHover={{ x: 4 }}
                        >
                          <Link className="h-4 w-4" />
                          <span>{copied ? 'Copied!' : 'Copy link'}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More options */}
              {isOwnPost ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMenu(!showMenu)}
                    className="group flex items-center justify-center p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreHorizontal className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 z-30"
                        variants={slideInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
                          <motion.button
                            onClick={handleEdit}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                            whileHover={{ x: 4 }}
                          >
                            <Edit3 className="h-4 w-4" />
                            <span>Edit post</span>
                          </motion.button>
                          <motion.button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            whileHover={{ x: 4 }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{deleting ? 'Deleting...' : 'Delete post'}</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMenu(!showMenu)}
                    className="group flex items-center justify-center p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreHorizontal className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
                  </motion.button>

                  {/* Report Menu */}
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 z-30"
                        variants={slideInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
                          <motion.button
                            onClick={handleReportPost}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            whileHover={{ x: 4 }}
                          >
                            <Flag className="h-4 w-4" />
                            <span>Report post</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <CommentModal
            isOpen={showCommentModal}
            post={currentPost}
            onClose={() => setShowCommentModal(false)}
            onCommentCreated={onPostLiked}
          />
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditPostModal
            isOpen={showEditModal}
            post={currentPost}
            onClose={() => setShowEditModal(false)}
            onPostUpdated={handlePostUpdated}
          />
        )}
      </AnimatePresence>

      {/* Repost Modal */}
      <AnimatePresence>
        {showRepostModal && (
          <RepostModal
            isOpen={showRepostModal}
            post={currentPost}
            onClose={() => setShowRepostModal(false)}
            onRepostCreated={handleRepostCreated}
          />
        )}
      </AnimatePresence>

      {/* Report Proposal Modal */}
      <AnimatePresence>
        {showReportModal && (
          <CreateProposalModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onProposalCreated={handleProposalCreated}
            targetPostId={currentPost.id}
            defaultType="moderate_post"
          />
        )}
      </AnimatePresence>

      {/* Click outside handler for menus */}
      {(showMenu || showShareMenu) && (
        <motion.div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowMenu(false);
            setShowShareMenu(false);
          }}
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      )}
    </motion.article>
  );
};

export default PostCard; 