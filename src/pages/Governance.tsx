import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Proposal, Vote } from '../types';
import ProposalCard from '../components/ProposalCard';
import CreateProposalModal from '../components/CreateProposalModal';
import CreateProfile from '../components/CreateProfile';
import { 
  Scale, 
  Plus, 
  Search,
  Users,
  Gavel,
  FileText,
  BarChart3, 
  Vote as VoteIcon
} from 'lucide-react';
import { 
  pageVariants, 
  pageTransition, 
  staggerContainer, 
  itemVariants,
  fadeInUp,
  containerVariants
} from '../utils/animations';
import { useToast, createToast } from '../components/ui/ToastNotification';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const Governance: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'approved' | 'rejected' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Governance stats
  const [stats, setStats] = useState({
    totalProposals: 0,
    activeProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0,
    totalVotes: 0,
    participationRate: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProposals();
      // Show profile creation if user is authenticated but no profile exists
      if (!user?.username) {
        console.log('User authenticated but no username found, showing profile creation');
        setShowCreateProfile(true);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    updateStats();
  }, [proposals]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      // TODO: Implement get_proposals in backend and update here
      // const proposalsData = await actor.get_proposals();
      
      // Load from localStorage for development
      const localProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
      setProposals(localProposals);
      
      if (localProposals.length === 0) {
        // Create some mock proposals for demonstration
        const mockProposals: Proposal[] = [
          {
            id: 'proposal_1',
            proposer: user?.id || 'demo_user',
            proposer_username: user?.username || 'demo_user',
            title: 'Implement Community Moderation Guidelines',
            description: 'Proposal to establish clear community guidelines for content moderation, including procedures for reporting inappropriate content and consequences for violations.',
            proposal_type: 'change_rule',
            created_at: BigInt(Date.now() * 1000000),
            voting_deadline: BigInt((Date.now() + (24 * 60 * 60 * 1000)) * 1000000),
            status: 'active',
            votes_for: BigInt(8),
            votes_against: BigInt(3),
            total_votes: BigInt(11),
            voters: ['user1', 'user2', 'user3'],
          },
          {
            id: 'proposal_2',
            proposer: 'moderator_1',
            proposer_username: 'moderator_alice',
            title: 'Remove Inappropriate Post',
            description: 'This post contains spam content that violates our community guidelines. It should be removed to maintain the quality of our platform.',
            proposal_type: 'moderate_post',
            target_post_id: 'post_123',
            created_at: BigInt((Date.now() - 12 * 60 * 60 * 1000) * 1000000),
            voting_deadline: BigInt((Date.now() + (12 * 60 * 60 * 1000)) * 1000000),
            status: 'active',
            votes_for: BigInt(15),
            votes_against: BigInt(2),
            total_votes: BigInt(17),
            voters: ['user4', 'user5', 'user6'],
          },
        ];
        setProposals(mockProposals);
        localStorage.setItem('proposals', JSON.stringify(mockProposals));
      }
      
      addToast(createToast.info(
        'Welcome to Governance!',
        'Participate in community decisions and proposals'
      ));
    } catch (error) {
      console.error('Error loading proposals:', error);
      console.log('Using local proposals as fallback...');
      
      // Load from localStorage for development
      const localProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
      setProposals(localProposals);
      
      if (localProposals.length === 0) {
        // Create some mock proposals for demonstration
        const mockProposals: Proposal[] = [
          {
            id: 'proposal_1',
            proposer: user?.id || 'demo_user',
            proposer_username: user?.username || 'demo_user',
            title: 'Implement Community Moderation Guidelines',
            description: 'Proposal to establish clear community guidelines for content moderation, including procedures for reporting inappropriate content and consequences for violations.',
            proposal_type: 'change_rule',
            created_at: BigInt(Date.now() * 1000000),
            voting_deadline: BigInt((Date.now() + (24 * 60 * 60 * 1000)) * 1000000),
            status: 'active',
            votes_for: BigInt(8),
            votes_against: BigInt(3),
            total_votes: BigInt(11),
            voters: ['user1', 'user2', 'user3'],
          },
          {
            id: 'proposal_2',
            proposer: 'moderator_1',
            proposer_username: 'moderator_alice',
            title: 'Remove Inappropriate Post',
            description: 'This post contains spam content that violates our community guidelines. It should be removed to maintain the quality of our platform.',
            proposal_type: 'moderate_post',
            target_post_id: 'post_123',
            created_at: BigInt((Date.now() - 12 * 60 * 60 * 1000) * 1000000),
            voting_deadline: BigInt((Date.now() + (12 * 60 * 60 * 1000)) * 1000000),
            status: 'active',
            votes_for: BigInt(15),
            votes_against: BigInt(2),
            total_votes: BigInt(17),
            voters: ['user4', 'user5', 'user6'],
          },
        ];
        setProposals(mockProposals);
        localStorage.setItem('proposals', JSON.stringify(mockProposals));
      }
      
      addToast(createToast.info(
        'Welcome to Governance!',
        'Participate in community decisions and proposals'
      ));
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = proposals.length;
    const active = proposals.filter(p => p.status === 'active').length;
    const approved = proposals.filter(p => p.status === 'approved').length;
    const rejected = proposals.filter(p => p.status === 'rejected').length;
    const totalVotes = proposals.reduce((sum, p) => sum + Number(p.total_votes), 0);
    
    // Simple participation rate calculation
    const participationRate = total > 0 ? (totalVotes / (total * 10)) * 100 : 0; // Assuming 10 potential voters per proposal
    
    setStats({
      totalProposals: total,
      activeProposals: active,
      approvedProposals: approved,
      rejectedProposals: rejected,
      totalVotes,
      participationRate: Math.min(participationRate, 100),
    });
  };

  const handleProposalCreated = async (newProposal: Proposal) => {
    setProposals(prev => [newProposal, ...prev]);
    // Refresh from backend to ensure sync
    await loadProposals();
  };

  const handleVoteSuccess = (proposalId: string, vote: Vote) => {
    setProposals(prev => 
      prev.map(proposal => {
        if (proposal.id === proposalId) {
          const isApprove = vote.vote_type === 'approve';
          return {
            ...proposal,
            votes_for: isApprove ? proposal.votes_for + BigInt(1) : proposal.votes_for,
            votes_against: !isApprove ? proposal.votes_against + BigInt(1) : proposal.votes_against,
            total_votes: proposal.total_votes + BigInt(1),
            voters: [...proposal.voters, vote.voter],
          };
        }
        return proposal;
      })
    );
  };

  const handleProfileCreated = () => {
    setShowCreateProfile(false);
    window.location.reload();
  };

  // Filter proposals
  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = activeFilter === 'all' || proposal.status === activeFilter;
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.proposer_username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All Proposals', count: proposals.length },
    { value: 'active', label: 'Active', count: stats.activeProposals },
    { value: 'approved', label: 'Approved', count: stats.approvedProposals },
    { value: 'rejected', label: 'Rejected', count: stats.rejectedProposals },
    { value: 'expired', label: 'Expired', count: proposals.filter(p => p.status === 'expired').length },
  ];

  const statCards = [
    {
      title: 'Total Proposals',
      value: stats.totalProposals,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      change: '+12%',
      changeColor: 'text-green-500',
    },
    {
      title: 'Active Votes',
      value: stats.activeProposals,
      icon: VoteIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      change: '+5%',
      changeColor: 'text-green-500',
    },
    {
      title: 'Total Votes Cast',
      value: stats.totalVotes,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      change: '+23%',
      changeColor: 'text-green-500',
    },
    {
      title: 'Participation Rate',
      value: `${stats.participationRate.toFixed(1)}%`,
      icon: BarChart3,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      change: '+8%',
      changeColor: 'text-green-500',
    },
  ];

  if (!isAuthenticated) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center"
      >
        <div className="text-center">
          <Scale className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Governance Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to participate in governance
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Scale className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Governance
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Participate in community decisions and shape the future of the platform
              </p>
            </div>
            
            <AnimatedButton
              onClick={() => setShowCreateProposal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Proposal</span>
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${stat.changeColor}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          vs last week
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={fadeInUp}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setActiveFilter(option.value as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === option.value
                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {option.label}
                    {option.count > 0 && (
                      <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                        {option.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Proposals List */}
        <motion.div
          variants={containerVariants}
          className="space-y-6"
        >
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : filteredProposals.length > 0 ? (
            filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <ProposalCard
                  proposal={proposal}
                  onVoteSuccess={handleVoteSuccess}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No proposals found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms or filters'
                  : 'Be the first to create a governance proposal'}
              </p>
              {!searchQuery && (
                <AnimatedButton
                  onClick={() => setShowCreateProposal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Create First Proposal
                </AnimatedButton>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create Proposal Modal */}
      <CreateProposalModal
        isOpen={showCreateProposal}
        onClose={() => setShowCreateProposal(false)}
        onProposalCreated={handleProposalCreated}
      />

      {/* Create Profile Modal */}
      <AnimatePresence>
        {showCreateProfile && (
          <CreateProfile
            onClose={() => setShowCreateProfile(false)}
            onProfileCreated={handleProfileCreated}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Governance; 