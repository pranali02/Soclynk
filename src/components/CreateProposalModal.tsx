import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Proposal } from '../types';
import { X, Scale, Shield, UserX, Settings, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast, createToast } from './ui/ToastNotification';
import { backdropVariants, slideInVariants } from '../utils/animations';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalCreated: (newProposal: Proposal) => void;
  targetPostId?: string;
  targetUserId?: string;
  defaultType?: 'moderate_post' | 'change_rule' | 'ban_user' | 'other';
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  isOpen,
  onClose,
  onProposalCreated,
  targetPostId,
  targetUserId,
  defaultType = 'other',
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposalType, setProposalType] = useState<'moderate_post' | 'change_rule' | 'ban_user' | 'other'>(defaultType);
  const [votingDuration, setVotingDuration] = useState(24);
  const [creating, setCreating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setProposalType(defaultType);
      setVotingDuration(24);
      if (targetPostId && proposalType !== 'moderate_post') {
        setProposalType('moderate_post');
      }
      if (targetUserId && proposalType !== 'ban_user') {
        setProposalType('ban_user');
      }
    }
  }, [isOpen, defaultType, targetPostId, targetUserId]);

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const proposalTypes = [
    {
      value: 'moderate_post' as const,
      label: 'Moderate Post',
      description: 'Report inappropriate content or request post removal',
      icon: Shield,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      value: 'ban_user' as const,
      label: 'Ban User',
      description: 'Propose to ban a user for violations',
      icon: UserX,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      value: 'change_rule' as const,
      label: 'Change Rule',
      description: 'Propose changes to platform rules or policies',
      icon: Settings,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      value: 'other' as const,
      label: 'Other',
      description: 'General proposal for platform improvements',
      icon: AlertTriangle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || creating) return;
    
    try {
      setCreating(true);
      
      // Create mock proposal for development
      const mockProposal: Proposal = {
        id: `proposal_${Date.now()}`,
        proposer: user?.id || '',
        proposer_username: user?.username || '',
        title: title.trim(),
        description: description.trim(),
        proposal_type: proposalType,
        target_post_id: targetPostId,
        target_user_id: targetUserId,
        created_at: BigInt(Date.now() * 1000000),
        voting_deadline: BigInt((Date.now() + (votingDuration * 60 * 60 * 1000)) * 1000000),
        status: 'active',
        votes_for: BigInt(0),
        votes_against: BigInt(0),
        total_votes: BigInt(0),
        voters: [],
      };

      // Store for development
      const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');
      proposals.push(mockProposal);
      localStorage.setItem('proposals', JSON.stringify(proposals));

      onProposalCreated(mockProposal);
      onClose();
      
      addToast(createToast.success(
        'Proposal created locally!',
        'Your proposal will be synced when connection is restored'
      ));
    } catch (error) {
      console.error('Error creating proposal:', error);
      
      // Create mock proposal for development
      const mockProposal: Proposal = {
        id: `proposal_${Date.now()}`,
        proposer: user?.id || '',
        proposer_username: user?.username || '',
        title: title.trim(),
        description: description.trim(),
        proposal_type: proposalType,
        target_post_id: targetPostId,
        target_user_id: targetUserId,
        created_at: BigInt(Date.now() * 1000000),
        voting_deadline: BigInt((Date.now() + (votingDuration * 60 * 60 * 1000)) * 1000000),
        status: 'active',
        votes_for: BigInt(0),
        votes_against: BigInt(0),
        total_votes: BigInt(0),
        voters: [],
      };

      // Store for development
      const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');
      proposals.push(mockProposal);
      localStorage.setItem('proposals', JSON.stringify(proposals));

      onProposalCreated(mockProposal);
      onClose();
      
      addToast(createToast.success(
        'Proposal created locally!',
        'Your proposal will be synced when connection is restored'
      ));
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setProposalType('other');
    setVotingDuration(24);
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
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-hidden"
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <Scale className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Governance Proposal
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
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Proposal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Proposal Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {proposalTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setProposalType(type.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          proposalType === type.value
                            ? `border-blue-500 ${type.bgColor}`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${type.color}`} />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {type.label}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear, descriptive title"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  maxLength={100}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {title.length}/100
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  ref={textareaRef}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    autoResizeTextarea();
                  }}
                  placeholder="Provide a detailed explanation of your proposal, including rationale and expected outcomes..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  maxLength={1000}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {description.length}/1000
                  </span>
                </div>
              </div>

              {/* Voting Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voting Duration (hours)
                </label>
                <select
                  value={votingDuration}
                  onChange={(e) => setVotingDuration(Number(e.target.value))}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={72}>72 hours</option>
                  <option value={168}>1 week</option>
                </select>
              </div>

              {/* Target Information */}
              {(targetPostId || targetUserId) && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Target Information
                  </h4>
                  {targetPostId && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Post ID: {targetPostId}
                    </p>
                  )}
                  {targetUserId && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      User ID: {targetUserId}
                    </p>
                  )}
                </div>
              )}
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
                disabled={!title.trim() || !description.trim() || creating}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Scale className="h-4 w-4" />
                    <span>Create Proposal</span>
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

export default CreateProposalModal; 