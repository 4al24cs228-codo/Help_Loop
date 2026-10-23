import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Star, CheckCircle, Clock, Shield, Heart, BookOpen, Leaf,
  Users, Droplets, TrendingUp, Download, Share2, ExternalLink, ChevronRight,
  Sparkles, Trophy, Zap, Lock
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

// --- Types ---
interface MilestoneTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked' | 'not-started';
  points: number;
  progress?: number;
  maxProgress?: number;
}

interface MilestoneLevel {
  level: number;
  title: string;
  badge: string;
  badgeColor: string;
  tasks: MilestoneTask[];
  reward: string;
  rewardIcon: string;
  unlocked: boolean;
  completed: boolean;
}

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: string;
  category: string;
}

// --- Demo Data ---
const DEMO_LEVELS: MilestoneLevel[] = [
  {
    level: 1,
    title: 'Kindness Starter',
    badge: '🌱',
    badgeColor: 'from-emerald-400 to-green-500',
    reward: 'Green Sprout Badge',
    rewardIcon: '🌱',
    unlocked: true,
    completed: true,
    tasks: [
      { id: 't1-1', title: 'Complete your profile', description: 'Add a photo, bio, and interests', status: 'completed', points: 50 },
      { id: 't1-2', title: 'Make your first contribution', description: 'Contribute ₹10+ to any verified campaign OR join a volunteering event', status: 'completed', points: 100 },
      { id: 't1-3', title: 'Explore or join a community', description: 'Browse HelpCircles and join one that resonates with you', status: 'completed', points: 50 },
    ],
  },
  {
    level: 2,
    title: 'Active Supporter',
    badge: '⭐',
    badgeColor: 'from-amber-400 to-yellow-500',
    reward: 'Golden Star Badge',
    rewardIcon: '⭐',
    unlocked: true,
    completed: false,
    tasks: [
      { id: 't2-1', title: 'Complete another helping activity', description: 'Donate to a second campaign or volunteer at an event', status: 'completed', points: 100 },
      { id: 't2-2', title: 'Attend a verified volunteering event', description: 'Register and attend any open volunteering event', status: 'in-progress', points: 150, progress: 1, maxProgress: 1 },
      { id: 't2-3', title: 'Participate in a community activity', description: 'Post, comment, or share in a HelpCircle', status: 'not-started', points: 75 },
    ],
  },
  {
    level: 3,
    title: 'Community Champion',
    badge: '🏆',
    badgeColor: 'from-emerald-500 to-teal-600',
    reward: 'Champion Emblem',
    rewardIcon: '🏆',
    unlocked: false,
    completed: false,
    tasks: [
      { id: 't3-1', title: 'Support 3+ distinct causes', description: 'Contribute to campaigns across at least 3 different categories', status: 'locked', points: 200 },
      { id: 't3-2', title: 'Complete 5 verified community activities', description: 'Verified event attendance, posts, and circle contributions', status: 'locked', points: 250, progress: 2, maxProgress: 5 },
      { id: 't3-3', title: 'Submit an accepted impact report', description: 'Share a post-event impact report from your volunteering', status: 'locked', points: 150 },
    ],
  },
  {
    level: 4,
    title: 'Certified Impact Contributor',
    badge: '🎓',
    badgeColor: 'from-violet-500 to-purple-600',
    reward: 'Downloadable HelpLoop Impact Certificate',
    rewardIcon: '🎓',
    unlocked: false,
    completed: false,
    tasks: [
      { id: 't4-1', title: 'Complete Levels 1, 2 & 3', description: 'Finish all previous milestone levels', status: 'locked', points: 0 },
      { id: 't4-2', title: 'Complete 10+ eligible verified activities', description: 'Donations, events, posts, and community engagement', status: 'locked', points: 300, progress: 3, maxProgress: 10 },
      { id: 't4-3', title: 'Participate in 3+ activity categories', description: 'Covering financial help, volunteering, and community', status: 'locked', points: 200 },
    ],
  },
];

const DEMO_BADGES: BadgeItem[] = [
  { id: 'b1', name: 'Kindness Starter', description: 'Completed your first helping activity on HelpLoop', icon: '🌱', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', earned: true, earnedAt: '2026-10-18T00:00:00Z', category: 'Milestone' },
  { id: 'b2', name: 'Community Builder', description: 'Joined and actively contributed to 3+ HelpCircles', icon: '🤝', color: 'bg-blue-100 text-blue-700 border-blue-200', earned: true, earnedAt: '2026-10-19T00:00:00Z', category: 'Community' },
  { id: 'b3', name: 'Education Supporter', description: 'Contributed to 2+ educational campaigns', icon: '📚', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', earned: true, earnedAt: '2026-10-20T00:00:00Z', category: 'Category' },
  { id: 'b4', name: 'Active Volunteer', description: 'Attended 3+ verified volunteering events', icon: '🙌', color: 'bg-teal-100 text-teal-700 border-teal-200', earned: false, category: 'Activity' },
  { id: 'b5', name: 'Eco Warrior', description: 'Participated in 2+ environmental clean-up drives', icon: '🌿', color: 'bg-green-100 text-green-700 border-green-200', earned: false, category: 'Activity' },
  { id: 'b6', name: 'Medical Supporter', description: 'Contributed ₹1,000+ to medical campaigns', icon: '❤️‍🩹', color: 'bg-rose-100 text-rose-700 border-rose-200', earned: false, category: 'Category' },
  { id: 'b7', name: 'Consistent Helper', description: 'Helped for 3+ consecutive months', icon: '⚡', color: 'bg-amber-100 text-amber-700 border-amber-200', earned: false, category: 'Streak' },
  { id: 'b8', name: 'Transparency Champion', description: 'Shared 5+ verified campaign updates', icon: '🔍', color: 'bg-purple-100 text-purple-700 border-purple-200', earned: false, category: 'Special' },
  { id: 'b9', name: 'Community Champion', description: 'Reached Level 3 in the Impact Journey', icon: '🏆', color: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300', earned: false, category: 'Milestone' },
];

const RECENT_ACTIVITIES = [
  { id: 'ra-1', title: 'Demo donation to Aarav\'s Surgery', points: 50, date: '2026-10-21T18:20:00Z', icon: '💚', verified: true },
  { id: 'ra-2', title: 'Joined Education for All HelpCircle', points: 50, date: '2026-10-20T12:00:00Z', icon: '👥', verified: true },
  { id: 'ra-3', title: 'Registered for Blood Donation Camp', points: 150, date: '2026-10-19T09:00:00Z', icon: '🩸', verified: true },
  { id: 'ra-4', title: 'Shared a community impact story', points: 25, date: '2026-10-18T10:00:00Z', icon: '📢', verified: false },
  { id: 'ra-5', title: 'Commented and engaged on campaigns', points: 10, date: '2026-10-17T15:00:00Z', icon: '💬', verified: false },
];

export default function ImpactPassportPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { goodnessPoints, addGoodnessPoints } = useAppStore();
  const [activeTab, setActiveTab] = useState<'journey' | 'badges' | 'certificates' | 'history'>('journey');
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);

  const earnedBadges = DEMO_BADGES.filter(b => b.earned);
  const totalPoints = goodnessPoints;
  const level2Progress = 2; // out of 3 tasks

  const handleDownloadCertificate = () => {
    navigate('/certificate/HLP-CERT-2026-KS001');
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(`I just completed the Kindness Starter milestone on @HelpLoop! 🌱 Real People. Real Help. A Stronger Tomorrow. #HelpLoop #SocialImpact`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://helploop.in/impact&summary=${text}`, '_blank');
    toast.success('LinkedIn sharing opened in a new tab!');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 p-6 mb-6 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>
          <div className="relative flex items-center gap-6">
            <div className="relative">
              <Avatar
                size="xl"
                name={user?.name || 'User'}
                src={user?.avatarUrl || user?.avatar}
                isOnline
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-white">
                L2
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{user?.name || 'User'}'s Impact Passport</h1>
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-semibold">
                  Active Supporter
                </span>
              </div>
              <p className="text-emerald-100 text-sm mb-3">@{user?.username || 'user'} · Joined HelpLoop</p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                  <p className="text-xl font-bold">{totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-emerald-100">Goodness Points</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                  <p className="text-xl font-bold">{earnedBadges.length}</p>
                  <p className="text-xs text-emerald-100">Badges Earned</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                  <p className="text-xl font-bold">24</p>
                  <p className="text-xs text-emerald-100">Hours Volunteered</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                  <p className="text-xl font-bold">3</p>
                  <p className="text-xs text-emerald-100">Campaigns Supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          {([
            { id: 'journey', label: 'Impact Journey', icon: '🗺️' },
            { id: 'badges', label: 'Badges', icon: '🏅' },
            { id: 'certificates', label: 'Certificates', icon: '🎓' },
            { id: 'history', label: 'Impact History', icon: '📋' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              )}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Journey Tab */}
        {activeTab === 'journey' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Complete milestone levels to earn badges, certificates, and special recognition. All activities are optional.
            </p>
            {DEMO_LEVELS.map((level) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'rounded-2xl border overflow-hidden transition-all',
                  level.completed
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : level.unlocked
                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-70'
                )}
              >
                {/* Level Header */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setExpandedLevel(expandedLevel === level.level ? null : level.level)}
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm',
                    `bg-gradient-to-br ${level.badgeColor}`
                  )}>
                    {level.badge}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">LEVEL {level.level}</span>
                      {level.completed && (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {!level.unlocked && (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{level.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reward: {level.reward}</p>
                  </div>
                  <ChevronRight className={cn(
                    'w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
                    expandedLevel === level.level && 'rotate-90'
                  )} />
                </button>

                {/* Expanded Tasks */}
                <AnimatePresence>
                  {expandedLevel === level.level && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                        {level.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-xl border',
                              task.status === 'completed'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                : task.status === 'in-progress'
                                ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                                : task.status === 'locked'
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            )}
                          >
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                              task.status === 'completed' ? 'bg-emerald-500 text-white' :
                              task.status === 'in-progress' ? 'bg-blue-500 text-white' :
                              task.status === 'locked' ? 'bg-gray-300 dark:bg-gray-600 text-gray-400' :
                              'bg-gray-200 dark:bg-gray-700 text-gray-400'
                            )}>
                              {task.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                               task.status === 'locked' ? <Lock className="w-4 h-4" /> :
                               task.status === 'in-progress' ? <Clock className="w-4 h-4" /> :
                               <span className="text-xs">•</span>}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>
                              {task.progress !== undefined && task.maxProgress && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>{task.progress}/{task.maxProgress}</span>
                                    <span>{Math.round((task.progress / task.maxProgress) * 100)}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+{task.points} pts</span>
                              <p className="text-[10px] text-gray-400 mt-0.5">{
                                task.status === 'completed' ? 'Earned!' :
                                task.status === 'in-progress' ? 'In Progress' :
                                task.status === 'locked' ? 'Locked' :
                                'Not Started'
                              }</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Earned Badges ({earnedBadges.length}/{DEMO_BADGES.length})</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DEMO_BADGES.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'p-4 rounded-2xl border text-center transition-all',
                    badge.earned
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50'
                  )}
                >
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 border-2',
                    badge.earned ? badge.color : 'bg-gray-100 text-gray-400 border-gray-200',
                  )}>
                    {badge.earned ? badge.icon : <Lock className="w-6 h-6" />}
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                  {badge.earned && badge.earnedAt && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-semibold">
                      Earned {new Date(badge.earnedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <span className="text-[10px] text-gray-400 mt-1 inline-block">{badge.category}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Complete milestone levels to earn downloadable HelpLoop Impact Certificates.
            </p>

            {/* Available Certificate */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-3xl flex-shrink-0">
                  🌱
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                      ✓ Available
                    </span>
                    <span className="text-xs text-gray-400">Level 1 Complete</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Community Impact Certificate — Kindness Starter</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Issued by HelpLoop Social Impact Platform. Recognises completion of the Kindness Starter milestone including verified community contribution and engagement.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Issue Date: October 2026 · ID: HLP-CERT-2026-KS001</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="primary" leftIcon={<Download className="w-4 h-4" />} onClick={handleDownloadCertificate}>
                      View Certificate
                    </Button>
                    <Button size="sm" variant="outline" leftIcon={<Share2 className="w-4 h-4" />} onClick={handleShareLinkedIn}>
                      Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Certificates */}
            {[
              { level: 2, title: 'Active Supporter Certificate', badge: '⭐', requirement: 'Complete Level 2 milestone' },
              { level: 3, title: 'Community Champion Certificate', badge: '🏆', requirement: 'Complete Level 3 milestone' },
              { level: 4, title: 'Certified Impact Contributor Certificate', badge: '🎓', requirement: 'Complete Level 4 milestone' },
            ].map((cert) => (
              <div key={cert.level} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl flex-shrink-0 grayscale">
                    {cert.badge}
                  </div>
                  <div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                      🔒 Level {cert.level} Required
                    </span>
                    <h3 className="font-bold text-gray-700 dark:text-gray-400 mt-1">{cert.title}</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{cert.requirement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Impact History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Recent Verified Activities</h2>
            {RECENT_ACTIVITIES.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{activity.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {activity.verified ? ' · ✓ Verified' : ' · Self-reported'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">+{activity.points}</p>
                  <p className="text-[10px] text-gray-400">pts</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
