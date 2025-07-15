import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthenticatedActor } from '../services/actor';
import { X, User, FileText, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast, createToast } from './ui/ToastNotification';
import { backdropVariants, slideInVariants } from '../utils/animations';

interface CreateProfileProps {
  onClose: () => void;
  onProfileCreated: () => void;
  isEdit?: boolean;
  initialData?: {
    username: string;
    bio: string;
    profile_picture?: string;
  };
}

const CreateProfile: React.FC<CreateProfileProps> = ({
  onClose,
  onProfileCreated,
  isEdit = false,
  initialData,
}) => {
  const { addToast } = useToast();
  const [username, setUsername] = useState(initialData?.username || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [profilePicture, setProfilePicture] = useState(initialData?.profile_picture || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (username.trim().length > 50) {
      setError('Username must be less than 50 characters');
      return;
    }

    // Basic username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username.trim())) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    if (saving) return;
    
    try {
      setSaving(true);
      setError('');
      
      console.log('Creating/updating profile with data:', {
        username: username.trim(),
        bio: bio.trim(),
        profile_picture: profilePicture.trim() || undefined,
      });

      const actor = await getAuthenticatedActor();
      
      const profileData = {
        username: username.trim(),
        bio: bio.trim(),
        profile_picture: profilePicture.trim() || undefined,
      };

      const result = isEdit
        ? await actor.update_user(profileData)
        : await actor.create_user(profileData);
      
      console.log('Profile creation result:', result);

      if (result && result.Ok) {
        addToast(createToast.success(
          isEdit ? 'Profile updated!' : 'Profile created!',
          isEdit ? 'Your profile has been updated successfully' : 'Welcome to Soclynk! Your profile is ready'
        ));
        onProfileCreated();
      } else {
        const errorMessage = result?.Err || 'An error occurred while saving your profile';
        console.error('Profile creation failed:', errorMessage);
        setError(errorMessage);
        addToast(createToast.error(
          'Profile creation failed',
          errorMessage
        ));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving profile';
      setError(errorMessage);
      addToast(createToast.error(
        'Profile creation failed',
        'Please check your connection and try again'
      ));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800"
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Profile' : 'Create Your Profile'}
            </h2>
            <button
              onClick={handleClose}
              disabled={saving}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </motion.div>
            )}
            
            {/* Username Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <User className="w-4 h-4" />
                <span>Username *</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your username"
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={saving}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                3-50 characters, letters, numbers, and underscores only
              </p>
            </div>
            
            {/* Bio Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FileText className="w-4 h-4" />
                <span>Bio</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                disabled={saving}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Optional - share what makes you unique
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {bio.length}/500
                </span>
              </div>
            </div>
            
            {/* Profile Picture Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <ImageIcon className="w-4 h-4" />
                <span>Profile Picture URL</span>
              </label>
              <input
                type="url"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optional - paste a link to your profile image
              </p>
            </div>

            {/* Preview */}
            {(username || bio || profilePicture) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        ((e.target as HTMLImageElement).nextElementSibling as HTMLElement)!.style.display = 'flex';
                      }} />
                    ) : null}
                    <span className={profilePicture ? 'hidden' : ''}>
                      {username.slice(0, 2).toUpperCase() || 'US'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {username || 'Your Username'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {bio || 'Your bio will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !username.trim()}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors duration-200 font-medium disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{isEdit ? 'Update' : 'Create Profile'}</span>
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

export default CreateProfile; 