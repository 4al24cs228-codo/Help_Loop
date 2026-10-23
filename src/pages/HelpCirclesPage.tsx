import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Sparkles,
  Heart,
  Check,
  ShieldCheck,
  Flame,
  Globe,
  ArrowRight,
  Filter,
  X,
  Compass,
  MessageCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { cn, formatIndianNumber } from '../lib/utils';

export interface HelpCircleItem {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  activeCount: number;
  coverImage: string;
  avatar: string;
  cause: string;
  isFeatured: boolean;
  isJoined: boolean;
}

const DEMO_CIRCLES: HelpCircleItem[] = [
  {
    id: 'circle-1',
    name: 'Medical Support Network',
    description:
      'Connecting verified medical volunteers and supporters for urgent health campaigns and emergency patient supplies.',
    category: 'Healthcare',
    memberCount: 10400,
    activeCount: 340,
    coverImage:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&auto=format&fit=crop&q=80',
    cause: 'Medical Aid & Blood Donation',
    isFeatured: true,
    isJoined: false,
  },
  {
    id: 'circle-2',
    name: 'Education for All',
    description:
      'Supporting scholarship drives, free tutoring, and digital access for underprivileged students across communities.',
    category: 'Education',
    memberCount: 6240,
    activeCount: 186,
    coverImage:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=80&auto=format&fit=crop&q=80',
    cause: 'Education & Scholarships',
    isFeatured: true,
    isJoined: true,
  },
  {
    id: 'circle-3',
    name: 'Food Relief Heroes',
    description:
      'Organizing daily meal drives, ration distribution, and hunger alleviation programs across local shelter homes.',
    category: 'Food Rescue',
    memberCount: 19200,
    activeCount: 541,
    coverImage:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80&auto=format&fit=crop&q=80',
    cause: 'Hunger Relief',
    isFeatured: false,
    isJoined: false,
  },
  {
    id: 'circle-4',
    name: 'Clean & Green',
    description:
      'Environmental warriors organizing beach cleanups, urban tree plantations, and eco-awareness drives.',
    category: 'Environment',
    memberCount: 5340,
    activeCount: 128,
    coverImage:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=80&auto=format&fit=crop&q=80',
    cause: 'Environmental Conservation',
    isFeatured: true,
    isJoined: false,
  },
  {
    id: 'circle-5',
    name: 'Blood Donors India',
    description:
      'Emergency blood donation and rare blood group coordination network operating across 50+ cities.',
    category: 'Healthcare',
    memberCount: 15100,
    activeCount: 420,
    coverImage:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=80&auto=format&fit=crop&q=80',
    cause: 'Blood Donation',
    isFeatured: false,
    isJoined: false,
  },
  {
    id: 'circle-6',
    name: 'HelpLoop Hands',
    description:
      'General purpose mutual aid network for community members to request and offer everyday neighborhood assistance.',
    category: 'Community',
    memberCount: 43000,
    activeCount: 1200,
    coverImage:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&auto=format&fit=crop&q=80',
    cause: 'General Community Help',
    isFeatured: false,
    isJoined: true,
  },
];

const CATEGORIES = [
  'All',
  'Environment',
  'Healthcare',
  'Education',
  'Food Rescue',
  'Disaster Relief',
  'Community',
] as const;

export const HelpCirclesPage: React.FC = () => {
  const navigate = useNavigate();
  const { addGoodnessPoints, goodnessPoints } = useAppStore();
  const { user } = useAuthStore();

  const [circles, setCircles] = useState<HelpCircleItem[]>(DEMO_CIRCLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'members' | 'active' | 'name'>('members');

  // Create circle modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleCategory, setNewCircleCategory] = useState('Healthcare');
  const [newCircleCause, setNewCircleCause] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Join / Leave Circle
  const handleToggleJoin = (e: React.MouseEvent, circle: HelpCircleItem) => {
    e.stopPropagation();

    if (!circle.isJoined) {
      // Joining circle
      setCircles((prev) =>
        prev.map((c) =>
          c.id === circle.id
            ? { ...c, isJoined: true, memberCount: c.memberCount + 1 }
            : c
        )
      );
      addGoodnessPoints(50);
      toast.success(`Joined ${circle.name}! (+50 Goodness Points) 🎉`, {
        icon: '💚',
      });
    } else {
      // Already joined - leave or alert
      setCircles((prev) =>
        prev.map((c) =>
          c.id === circle.id
            ? { ...c, isJoined: false, memberCount: Math.max(0, c.memberCount - 1) }
            : c
        )
      );
      toast(`You left ${circle.name}`, { icon: '👋' });
    }
  };

  // Handle Create Circle Submit
  const handleCreateCircleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim() || !newCircleDescription.trim()) return;

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 500));

    const newId = `circle-${Date.now()}`;
    const createdCircle: HelpCircleItem = {
      id: newId,
      name: newCircleName.trim(),
      category: newCircleCategory,
      cause: newCircleCause.trim() || `${newCircleCategory} Initiatives`,
      description: newCircleDescription.trim(),
      memberCount: 1,
      activeCount: 1,
      coverImage:
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      avatar:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&auto=format&fit=crop&q=80',
      isFeatured: false,
      isJoined: true,
    };

    setCircles((prev) => [createdCircle, ...prev]);
    addGoodnessPoints(100);
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setNewCircleName('');
    setNewCircleCause('');
    setNewCircleDescription('');

    toast.success(`Circle "${createdCircle.name}" created! (+100 Goodness Points) 🚀`);
  };

  // Filter & sort circles
  const filteredCircles = circles
    .filter((circle) => {
      const matchesCategory =
        selectedCategory === 'All' ? true : circle.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        circle.name.toLowerCase().includes(query) ||
        circle.description.toLowerCase().includes(query) ||
        circle.cause.toLowerCase().includes(query) ||
        circle.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'members') return b.memberCount - a.memberCount;
      if (sortBy === 'active') return b.activeCount - a.activeCount;
      return a.name.localeCompare(b.name);
    });

  // Featured Circles (up to 3)
  const featuredCircles = circles.filter((c) => c.isFeatured).slice(0, 3);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ======================================================== */}
        {/* PAGE HEADER                                              */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow graphics */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Telegram-Style Impact Channels
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                HelpCircles Communities
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Connect with verified volunteer groups, coordinate local drives, and share emergency
                resources. Join circles to earn Goodness Points!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4 text-emerald-700" />}
                className="bg-white hover:bg-emerald-50 text-emerald-900 border-none font-bold shadow-lg"
              >
                Create Circle
              </Button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-2xl font-black tracking-tight">{circles.length}</p>
              <p className="text-xs text-emerald-200">Active Communities</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">
                {formatIndianNumber(
                  circles.reduce((acc, curr) => acc + curr.memberCount, 0)
                )}+
              </p>
              <p className="text-xs text-emerald-200">Total Volunteers</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-amber-300">+50 GP</p>
              <p className="text-xs text-emerald-200">Reward per Circle Join</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-emerald-300">
                {goodnessPoints} GP
              </p>
              <p className="text-xs text-emerald-200">Your Goodness Points</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEARCH & CATEGORY FILTER BAR                             */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search circles by name, cause or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-2xl text-sm border border-gray-200/80 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="members">Most Members</option>
                <option value="active">Most Active</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Tabs: All | Environment | Healthcare | Education | Food Rescue | Disaster Relief | Community */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0',
                    active
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-102'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200/70 dark:border-gray-700/60'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* FEATURED COMMUNITIES (3 Highlighted Cards)               */}
        {/* ======================================================== */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Featured Impact Circles
              </h2>
              <Badge variant="warning" size="sm" className="text-[10px]">
                Recommended
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredCircles.map((circle) => (
                <motion.div
                  key={circle.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate(`/helpcircles/${circle.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-700/70 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group"
                >
                  {/* Banner Image */}
                  <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={circle.coverImage}
                      alt={circle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shadow-xs">
                      {circle.category}
                    </span>

                    {/* Featured Tag */}
                    <span className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>

                    {/* Cause badge over bottom of banner */}
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-white/95 truncate max-w-[85%] drop-shadow-sm">
                      🎯 {circle.cause}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar & Title Row */}
                      <div className="flex items-center gap-3 mb-2.5">
                        <Avatar
                          src={circle.avatar}
                          name={circle.name}
                          size="md"
                          className="border-2 border-white dark:border-gray-800 shadow-sm"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-base text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {circle.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatIndianNumber(circle.memberCount)} members</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                              {circle.activeCount} active
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed mb-4">
                        {circle.description}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Circle <ArrowRight className="w-3.5 h-3.5" />
                      </span>

                      <Button
                        size="sm"
                        variant={circle.isJoined ? 'outline' : 'primary'}
                        onClick={(e) => handleToggleJoin(e, circle)}
                        leftIcon={
                          circle.isJoined ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )
                        }
                        className={cn(
                          'rounded-xl text-xs font-bold px-3 py-1.5',
                          circle.isJoined &&
                            'border-emerald-300 text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 dark:text-emerald-300'
                        )}
                      >
                        {circle.isJoined ? 'Joined' : 'Join (+50 GP)'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ALL COMMUNITIES LIST / GRID                              */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {selectedCategory === 'All' ? 'All Communities' : `${selectedCategory} Circles`}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {filteredCircles.length}
              </span>
            </div>
          </div>

          {filteredCircles.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-700">
              <Compass className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No HelpCircles found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                We couldn't find any community matching "{searchQuery}". Try selecting another
                category or create this circle yourself!
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Reset Filters
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create Circle
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCircles.map((circle) => (
                <motion.div
                  key={circle.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => navigate(`/helpcircles/${circle.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Row: Avatar, Info, Category Tag */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={circle.avatar}
                          name={circle.name}
                          size="md"
                          className="border border-gray-100 dark:border-gray-700"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {circle.name}
                          </h3>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            🎯 {circle.cause}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/60 whitespace-nowrap flex-shrink-0">
                        {circle.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed mb-4">
                      {circle.description}
                    </p>
                  </div>

                  {/* Footer Row: Metrics & Join Button */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {formatIndianNumber(circle.memberCount)}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        {circle.activeCount} online
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant={circle.isJoined ? 'outline' : 'primary'}
                      onClick={(e) => handleToggleJoin(e, circle)}
                      leftIcon={
                        circle.isJoined ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )
                      }
                      className={cn(
                        'rounded-xl text-xs font-bold px-3 py-1.5 flex-shrink-0',
                        circle.isJoined &&
                          'border-emerald-300 text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 dark:text-emerald-300'
                      )}
                    >
                      {circle.isJoined ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CREATE COMMUNITY CIRCLE MODAL                            */}
        {/* ======================================================== */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create a New HelpCircle"
          description="Form a volunteer group, lead impact missions, and organize community relief."
          size="md"
        >
          <form onSubmit={handleCreateCircleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="circle-name"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1"
              >
                Circle Name
              </label>
              <input
                id="circle-name"
                type="text"
                required
                value={newCircleName}
                onChange={(e) => setNewCircleName(e.target.value)}
                placeholder="e.g., Delhi Air Quality & Tree Wardens"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="circle-category"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1"
              >
                Category
              </label>
              <select
                id="circle-category"
                value={newCircleCategory}
                onChange={(e) => setNewCircleCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              >
                <option value="Healthcare">Healthcare & Medical</option>
                <option value="Environment">Environment & Green Impact</option>
                <option value="Education">Education & Mentorship</option>
                <option value="Food Rescue">Food Rescue & Meal Drives</option>
                <option value="Disaster Relief">Disaster Relief & Shelter</option>
                <option value="Community">General Community Help</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="circle-cause"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1"
              >
                Primary Cause / Mission
              </label>
              <input
                id="circle-cause"
                type="text"
                required
                value={newCircleCause}
                onChange={(e) => setNewCircleCause(e.target.value)}
                placeholder="e.g., Tree Planting & Urban Afforestation"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="circle-description"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1"
              >
                Description & Goals
              </label>
              <textarea
                id="circle-description"
                rows={3}
                required
                value={newCircleDescription}
                onChange={(e) => setNewCircleDescription(e.target.value)}
                placeholder="Explain who should join and what missions this circle undertakes..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Goodness Points Reward Banner */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                You will receive <strong>100 Goodness Points</strong> and automatically become the
                lead organizer of this circle!
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Launch Community Circle
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default HelpCirclesPage;
