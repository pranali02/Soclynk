import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostWithAuthor } from '../types';
import { X, Camera } from 'lucide-react';
import { useToast, createToast } from './ui/ToastNotification';
import { backdropVariants, slideInVariants } from '../utils/animations';

interface EditPostModalProps {
  isOpen: boolean;
  post: PostWithAuthor;
  onClose: () => void;
  onPostUpdated: (updatedPost: PostWithAuthor) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  post,
  onClose,
  onPostUpdated,
}) => {
  const { addToast } = useToast();
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.image_url || '');
  const [uploadedImage, setUploadedImage] = useState<string | null>(post.image_url || null);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setContent(post.content);
      setImageUrl(post.image_url || '');
      setUploadedImage(post.image_url || null);
    }
  }, [isOpen, post]);

  useEffect(() => {
    autoResizeTextarea();
  }, [content]);

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

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

  const removeImage = () => {
    setUploadedImage(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || saving) return;
    
    try {
      setSaving(true);
      
      // Since there's no backend update_post function, we'll update locally
      // In a real implementation, you'd want to add update_post to the backend
      const updatedPost: PostWithAuthor = {
        ...post,
        content: content.trim(),
        image_url: uploadedImage || imageUrl.trim() || undefined,
      };
      
      // Store the edit in localStorage for persistence
      const editedPosts = JSON.parse(localStorage.getItem('editedPosts') || '{}');
      editedPosts[post.id] = {
        content: content.trim(),
        image_url: uploadedImage || imageUrl.trim() || undefined,
        edited_at: Date.now(),
      };
      localStorage.setItem('editedPosts', JSON.stringify(editedPosts));
      
      onPostUpdated(updatedPost);
      onClose();
      
      addToast(createToast.success(
        'Post updated!',
        'Your changes have been saved successfully'
      ));
    } catch (error) {
      console.error('Error updating post:', error);
      addToast(createToast.error(
        'Update failed',
        'Unable to save your changes. Please try again.'
      ));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setContent(post.content);
    setImageUrl(post.image_url || '');
    setUploadedImage(post.image_url || null);
    onClose();
  };

  if (!isOpen) return null;

  const isContentChanged = content.trim() !== post.content || 
    (uploadedImage || imageUrl.trim()) !== (post.image_url || '');

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
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-hidden"
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Text Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Content
                </label>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {content.length}/500
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image
                </label>
                
                {/* Current Image */}
                {uploadedImage && (
                  <div className="relative mb-4">
                    <img
                      src={uploadedImage}
                      alt="Post content"
                      className="w-full max-h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}

                {/* Image URL Input */}
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste image URL"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-3"
                />

                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drop an image here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
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
                disabled={!content.trim() || !isContentChanged || saving}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditPostModal; 