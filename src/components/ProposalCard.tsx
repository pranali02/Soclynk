import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Proposal, Vote } from '../types';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Shield,
  UserX,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast, createToast } from './ui/ToastNotification';
import { cardVariants } from '../utils/animations';

interface ProposalCardProps {
  proposal: Proposal;
  onVoteSuccess: (proposalId: string, vote: Vote) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onVoteSuccess,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState<'approve' | 'reject' | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load user's vote status
  useEffect(() => {
    if (user?.id) {
      const hasVoted = proposal.voters.includes(user.id);
      if (hasVoted) {
        // Check localStorage for vote details
        const votes = JSON.parse(localStorage.getItem('userVotes') || '{}');
        const vote = votes[`${proposal.id}_${user.id}`];
        if (vote) {
          setUserVote(vote.vote_type);
        }
      }
    }
  }, [proposal.id, proposal.voters, user?.id]);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const formatTimeRemaining = (deadline: bigint) => {
    const deadlineDate = new Date(Number(deadline) / 1000000);
    const now = new Date();
    const diffMs = deadlineDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getProposalTypeConfig = (type: string) => {
    switch (type) {
      case 'moderate_post':
        return {
          icon: Shield,
          label: 'Moderate Post',
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      case 'ban_user':
        return {
          icon: UserX,
          label: 'Ban User',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-950/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
        };
      case 'change_rule':
        return {
          icon: Settings,
          label: 'Change Rule',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Other',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-950/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          label: 'Approved',
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950/20',
        };
      case 'rejected':
        return {
          icon: XCircle,
          label: 'Rejected',
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
        };
      case 'expired':
        return {
          icon: Timer,
          label: 'Expired',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-950/20',
        };
      default:
        return {
          icon: Clock,
          label: 'Active',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        };
    }
  };

  const handleVote = async (voteType: 'approve' | 'reject') => {
    if (voting || userVote || proposal.status !== 'active') return;
    
    try {
      setVoting(true);
      // TODO: Implement vote_on_proposal in backend and update here
      
      // Create mock vote for development
      const mockVote: Vote = {
        id: `vote_${Date.now()}`,
        proposal_id: proposal.id,
        voter: user?.id || '',
        voter_username: user?.username || '',
        vote_type: voteType,
        created_at: BigInt(Date.now() * 1000000),
        stake_weight: BigInt(1),
      };

      // Store vote locally
      const votes = JSON.parse(localStorage.getItem('userVotes') || '{}');
      votes[`${proposal.id}_${user?.id}`] = mockVote;
      localStorage.setItem('userVotes', JSON.stringify(votes));

      setUserVote(voteType);
      onVoteSuccess(proposal.id, mockVote);
      
      addToast(createToast.success(
        'Vote submitted locally!',
        'Your vote will be synced when connection is restored'
      ));
    } catch (error) {
      console.error('Error voting on proposal:', error);
      
      // Create mock vote for development
      const mockVote: Vote = {
        id: `vote_${Date.now()}`,
        proposal_id: proposal.id,
        voter: user?.id || '',
        voter_username: user?.username || '',
        vote_type: voteType,
        created_at: BigInt(Date.now() * 1000000),
        stake_weight: BigInt(1),
      };

      // Store vote locally
      const votes = JSON.parse(localStorage.getItem('userVotes') || '{}');
      votes[`${proposal.id}_${user?.id}`] = mockVote;
      localStorage.setItem('userVotes', JSON.stringify(votes));

      setUserVote(voteType);
      onVoteSuccess(proposal.id, mockVote);
      
      addToast(createToast.success(
        'Vote submitted locally!',
        'Your vote will be synced when connection is restored'
      ));
    } finally {
      setVoting(false);
    }
  };

  const typeConfig = getProposalTypeConfig(proposal.proposal_type);
  const statusConfig = getStatusConfig(proposal.status);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  // Calculate vote percentages
  const totalVotes = Number(proposal.total_votes);
  const votesFor = Number(proposal.votes_for);
  const votesAgainst = Number(proposal.votes_against);
  const approvalPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
  const rejectionPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;

  const isExpired = proposal.status === 'expired' || 
    new Date(Number(proposal.voting_deadline) / 1000000) < new Date();
  const canVote = proposal.status === 'active' && !userVote && !isExpired;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {/* Proposer Avatar */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ background: 'linear-gradient(135deg, #FAD126, #FF564E)' }}>
            {getInitials(proposal.proposer_username)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {proposal.proposer_username}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                proposed
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(proposal.created_at)}
              </span>
            </div>
            
            {/* Type and Status */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.borderColor} border`}>
                <TypeIcon className={`h-3 w-3 ${typeConfig.color}`} />
                <span className={typeConfig.color}>{typeConfig.label}</span>
              </div>
              
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor}`}>
                <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                <span className={statusConfig.color}>{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {proposal.title}
        </h3>
        <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${showDetails ? '' : 'line-clamp-3'}`}>
          {proposal.description}
        </p>
        {proposal.description.length > 200 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2"
          >
            {showDetails ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Target Information */}
      {(proposal.target_post_id || proposal.target_user_id) && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {proposal.target_post_id && (
              <div className="flex items-center space-x-2">
                <span>Target Post:</span>
                <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                  {proposal.target_post_id}
                </code>
              </div>
            )}
            {proposal.target_user_id && (
              <div className="flex items-center space-x-2">
                <span>Target User:</span>
                <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                  {proposal.target_user_id}
                </code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voting Progress */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </span>
          </div>
          {proposal.status === 'active' && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRemaining(proposal.voting_deadline)}</span>
            </div>
          )}
        </div>

        {/* Vote Bars */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Approve ({votesFor})
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {approvalPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${approvalPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ThumbsDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Reject ({votesAgainst})
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {rejectionPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${rejectionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Voting Buttons */}
      {canVote && (
        <div className="flex space-x-3">
          <motion.button
            onClick={() => handleVote('approve')}
            disabled={voting}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Approve</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleVote('reject')}
            disabled={voting}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Reject</span>
          </motion.button>
        </div>
      )}

      {/* User Vote Status */}
      {userVote && (
        <div className={`mt-3 p-3 rounded-xl ${
          userVote === 'approve' 
            ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300' 
            : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
        }`}>
          <div className="flex items-center space-x-2 text-sm font-medium">
            {userVote === 'approve' ? (
              <ThumbsUp className="h-4 w-4" />
            ) : (
              <ThumbsDown className="h-4 w-4" />
            )}
            <span>You voted to {userVote} this proposal</span>
          </div>
        </div>
      )}

      {/* Expired/Completed Status */}
      {!canVote && !userVote && proposal.status === 'active' && isExpired && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Timer className="h-4 w-4" />
            <span>Voting period has ended</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProposalCard; 