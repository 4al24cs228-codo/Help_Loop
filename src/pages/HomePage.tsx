import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  HeartHandshake,
  ShieldCheck,
  Flame,
  Award,
  ChevronRight,
  UserPlus,
  UserCheck,
  RefreshCw,
  Layers,
  Heart,
  Share2,
  Clock,
  Compass,
  ArrowRight,
  Info,
  ExternalLink,
} from 'lucide-react';

import { AppLayout } from '../components/layout';
import { StoriesCarousel } from '../components/feed/StoriesCarousel';
import { CommunityChampions } from '../components/feed/CommunityChampions';
import { PostCard } from '../components/feed/PostCard';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatINR, cn } from '../lib/utils';
import type { Post } from '../types';
import { DEMO_POSTS } from '../data/demoData';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------
// Demo Feed Posts (Sourced from comprehensive DEMO_POSTS dataset)
// ----------------------------------------------------------------------
const INITIAL_FEED_POSTS: Post[] = DEMO_POSTS.slice(0, 6);
const EXTRA_FEED_POSTS: Post[] = DEMO_POSTS.slice(6);

// Suggested Users for Right Panel
const SUGGESTED_USERS = [
  {
    id: 'sug-1',
    name: 'Dr. Anita Sharma',
    username: 'dr_anita_care',
    role: 'Pediatric Surgeon & Aid Coordinator',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    impactPoints: 4850,
    isVerified: true,
    mutualCauses: 'Child Healthcare, Emergency Relief',
  },
  {
    id: 'sug-2',
    name: 'Vikram Mehta',
    username: 'vikram_educate',
    role: 'Rural Education Innovator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    impactPoints: 2200,
    isVerified: true,
    mutualCauses: 'Digital Classrooms, STEM',
  },
  {
    id: 'sug-3',
    name: 'Priya Nair',
    username: 'priya_feedhope',
    role: 'Zero Hunger Mobilizer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    impactPoints: 3120,
    isVerified: true,
    mutualCauses: 'Food Rescue, Community Kitchens',
  },
];

type FeedTab = 'for-you' | 'following' | 'latest' | 'categories';

// ----------------------------------------------------------------------
// Right Panel Component
// ----------------------------------------------------------------------
const HomePageRightPanel: React.FC = () => {
  const navigate = useNavigate();
  const { goodnessPoints, campaigns } = useAppStore();
  const { user } = useAuthStore();

  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [showPointsModal, setShowPointsModal] = useState(false);

  const toggleFollowUser = (userId: string, name: string) => {
    setFollowedUserIds((prev) => {
      const isAlready = prev.includes(userId);
      if (isAlready) {
        toast.success(`Unfollowed ${name}`);
        return prev.filter((id) => id !== userId);
      } else {
        toast.success(`Following ${name} 👏`);
        return [...prev, userId];
      }
    });
  };

  // Top 2 trending campaigns
  const trendingCampaigns = campaigns.slice(0, 2);

  // Goodness points target calculations
  const currentPoints = goodnessPoints || user?.goodnessPoints || 340;
  const nextTierPoints = 500;
  const progressPercent = Math.min(100, Math.round((currentPoints / nextTierPoints) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Goodness Points Widget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-5 text-white shadow-lg"
      >
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Your Impact Balance
              </p>
              <h3 className="text-2xl font-black tracking-tight text-white">
                {currentPoints.toLocaleString()} <span className="text-xs font-medium text-emerald-100">GP</span>
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowPointsModal(true)}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
            title="How to earn points"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Progress to next tier */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-emerald-100 font-medium">
            <span>Silver Changemaker</span>
            <span>{currentPoints} / {nextTierPoints} GP</span>
          </div>
          <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full"
            />
          </div>
          <p className="text-[11px] text-emerald-100/90 flex items-center gap-1 pt-0.5">
            <Award className="w-3.5 h-3.5 text-amber-300 inline" />
            <span>{Math.max(0, nextTierPoints - currentPoints)} GP to reach Gold Impact Patron!</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <span className="text-emerald-100">Earn +100 GP volunteering</span>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-1 font-semibold text-white hover:underline cursor-pointer"
          >
            Explore <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* 2. Suggested Users */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-emerald-500" />
            Suggested Changemakers
          </h4>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Top verified</span>
        </div>

        <div className="space-y-3.5">
          {SUGGESTED_USERS.map((usr) => {
            const isFollowing = followedUserIds.includes(usr.id);
            return (
              <div key={usr.id} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={usr.avatar}
                    name={usr.name}
                    size="sm"
                    className="ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {usr.name}
                      </span>
                      {usr.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      @{usr.username}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                      {usr.role}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isFollowing ? 'outline' : 'primary'}
                  onClick={() => toggleFollowUser(usr.id, usr.name)}
                  className="flex-shrink-0 text-xs px-2.5 py-1 h-7"
                >
                  {isFollowing ? (
                    <span className="inline-flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      Following
                    </span>
                  ) : (
                    'Follow'
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Trending Campaigns */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            Trending Campaigns
          </h4>
          <button
            onClick={() => navigate('/donate')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            See all
          </button>
        </div>

        <div className="space-y-3.5">
          {trendingCampaigns.map((camp) => {
            const raised = camp.raisedAmount || camp.raised_amount || 0;
            const target = camp.targetAmount || camp.target_amount || 1;
            const progress = Math.min(100, Math.round((raised / target) * 100));

            return (
              <div
                key={camp.id}
                onClick={() => navigate(`/campaign/${camp.id}`)}
                className="group cursor-pointer rounded-xl p-2.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-gray-100 dark:border-gray-800 transition-all"
              >
                <div className="flex gap-2.5">
                  <img
                    src={camp.imageUrl || (camp as any).coverImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200'}
                    alt={camp.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                      {camp.category}
                    </span>
                    <h5 className="font-semibold text-xs text-gray-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                      {camp.title}
                    </h5>
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span>{formatINR(raised)}</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {camp.daysLeft ?? (camp as any).daysRemaining ?? 14} days left
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Donate <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer Mini Links */}
      <div className="px-2 text-center space-y-2 text-[11px] text-gray-400 dark:text-gray-500">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link to="/donate" className="hover:text-emerald-600 transition-colors">Verified Aid</Link>
          <span>•</span>
          <Link to="/explore" className="hover:text-emerald-600 transition-colors">Discovery</Link>
          <span>•</span>
          <Link to="/helpcircles" className="hover:text-emerald-600 transition-colors">Circles</Link>
          <span>•</span>
          <Link to="/impact" className="hover:text-emerald-600 transition-colors">Passport</Link>
        </div>
        <p>© 2026 HelpLoop. Verified Social Impact Platform.</p>
      </div>

      {/* Points Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Goodness Points (GP)
              </h3>
              <button
                onClick={() => setShowPointsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Goodness Points track your verified impact footprint across mutual aid, donations, and volunteering drives.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                <span>Volunteer for an open event</span>
                <strong className="font-bold">+100 GP</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                <span>Contribute to verified cause</span>
                <strong className="font-bold">+50 GP</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200">
                <span>Join a HelpCircle community</span>
                <strong className="font-bold">+50 GP</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200">
                <span>Share verified stories</span>
                <strong className="font-bold">+25 GP</strong>
              </div>
            </div>
            <Button
              variant="primary"
              fullWidth
              className="mt-5"
              onClick={() => setShowPointsModal(false)}
            >
              Got it
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Main HomePage Component
// ----------------------------------------------------------------------
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addGoodnessPoints } = useAppStore();

  const [posts, setPosts] = useState<Post[]>(INITIAL_FEED_POSTS);
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [followedAuthorIds, setFollowedAuthorIds] = useState<string[]>(['usr-2']);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // Available category pills
  const categories = ['All', 'Community', 'Volunteering', 'Disaster Relief', 'Healthcare'];

  // Tab Filtering & Sorting logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (activeTab === 'following') {
      result = result.filter(
        (p) => followedAuthorIds.includes(p.author.id) || p.isFollowingAuthor
      );
    } else if (activeTab === 'latest') {
      result.sort((a, b) => new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime());
    } else if (activeTab === 'categories') {
      if (selectedCategory !== 'All') {
        result = result.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    return result;
  }, [posts, activeTab, selectedCategory, followedAuthorIds]);

  // Social interactions
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          const delta = nextLiked ? 1 : -1;
          const currentLikes = post.likesCount ?? post.likes_count ?? 0;
          const newLikesCount = Math.max(0, currentLikes + delta);

          if (nextLiked) {
            addGoodnessPoints(5);
            toast.success('Applauded community story! +5 GP 🎉');
          }

          return {
            ...post,
            isLiked: nextLiked,
            likesCount: newLikesCount,
          };
        }
        return post;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextBookmarked = !post.isBookmarked;
          if (nextBookmarked) {
            toast.success('Saved to your bookmarks! 🔖');
          } else {
            toast.success('Removed from bookmarks');
          }
          return {
            ...post,
            isBookmarked: nextBookmarked,
          };
        }
        return post;
      })
    );
  };

  const handleFollowAuthor = (userId: string) => {
    setFollowedAuthorIds((prev) => {
      const isAlready = prev.includes(userId);
      if (isAlready) {
        toast.success('Unfollowed user');
        return prev.filter((id) => id !== userId);
      } else {
        toast.success('Following changemaker! 💚');
        return [...prev, userId];
      }
    });
  };

  const handleComment = (postId: string) => {
    toast('Comments opened for post', { icon: '💬' });
  };

  const handleShare = (postId: string, method: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/home#${postId}`);
      toast.success('Post link copied to clipboard! 📋');
    } else {
      toast.success('Story shared!');
    }
  };

  // Load more posts simulation
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPosts((prev) => [...prev, ...EXTRA_FEED_POSTS]);
      setIsLoadingMore(false);
      setHasMorePosts(false);
      toast.success('Loaded more stories!');
    }, 600);
  };

  return (
    <AppLayout rightPanel={<HomePageRightPanel />}>
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        {/* 1. Stories Carousel at Top */}
        <StoriesCarousel />

        {/* 2. Community Champions Section */}
        <CommunityChampions />

        {/* 3. Feed Filter Tabs */}
        <div className="sticky top-16 md:top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md pt-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide py-1">
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <button
                onClick={() => setActiveTab('for-you')}
                className={cn(
                  'relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                  activeTab === 'for-you'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                For You
              </button>

              <button
                onClick={() => setActiveTab('following')}
                className={cn(
                  'relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                  activeTab === 'following'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                Following
                {followedAuthorIds.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('latest')}
                className={cn(
                  'relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                  activeTab === 'latest'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                Latest
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={cn(
                  'relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                  activeTab === 'categories'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                Categories
              </button>
            </div>

            {/* Quick Explore Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/explore')}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 flex items-center gap-1"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Explore</span>
            </Button>
          </div>

          {/* Subcategory Pills when 'Categories' tab is active */}
          <AnimatePresence>
            {activeTab === 'categories' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1.5 pt-2 overflow-x-auto scrollbar-hide"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Social Feed Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                {activeTab === 'following'
                  ? 'No posts from people you follow yet'
                  : 'No stories found in this category'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-5">
                {activeTab === 'following'
                  ? 'Follow suggested changemakers or switch to the For You tab to see trending updates.'
                  : 'Check out other community topics or volunteer initiatives.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveTab('for-you');
                  setSelectedCategory('All');
                }}
              >
                Reset to For You feed
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostCard
                    post={post}
                    onLike={() => handleLikePost(post.id)}
                    onBookmark={() => handleBookmarkPost(post.id)}
                    onFollow={() => handleFollowAuthor(post.author.id)}
                    onComment={() => handleComment(post.id)}
                    onShare={(postId, method) => handleShare(postId, method)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* 5. Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="pt-2 text-center">
            {hasMorePosts ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full sm:w-auto px-8 rounded-xl border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:border-emerald-500"
              >
                {isLoadingMore ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                    Fetching verified updates...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                    View more community stories
                  </span>
                )}
              </Button>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium py-3">
                🎉 You're all caught up with the latest community impact!
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default HomePage;
