import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  ShieldCheck,
  Award,
  Calendar,
  Heart,
  TrendingUp,
  MapPin,
  FileText,
  Share2,
  ExternalLink,
  CheckCircle,
  Settings,
  Globe,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { DEMO_USERS, DEMO_POSTS, DEMO_BADGES } from '../data/demoData';
import { formatINR } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const { goodnessPoints, demoTransactions } = useAppStore();

  // Find user by username or fallback to current authenticated user
  const profileUser = username
    ? DEMO_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase()) || authUser
    : authUser;

  const isCurrentUser = !username || (authUser && authUser.username === username);
  const [activeTab, setActiveTab] = useState<'posts' | 'badges' | 'impact' | 'contributions'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const userPosts = DEMO_POSTS.filter((p) => p.author.id === profileUser?.id || p.author.username === profileUser?.username);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Header Cover Banner */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 relative">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar & Action Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-4 gap-4">
              <div className="relative inline-block">
                <Avatar
                  src={profileUser?.avatarUrl || profileUser?.avatar}
                  name={profileUser?.name || 'User'}
                  size="xl"
                  className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white dark:border-gray-900 shadow-xl"
                />
                {profileUser?.isVerified && (
                  <div
                    className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md"
                    title="Verified Changemaker"
                  >
                    <CheckCircle className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isCurrentUser ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-1.5" /> Edit Profile
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate('/impact')}>
                      <Award className="w-4 h-4 mr-1.5" /> Impact Passport
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => {
                        setIsFollowing(!isFollowing);
                        toast.success(isFollowing ? `Unfollowed @${profileUser?.username}` : `Followed @${profileUser?.username}!`);
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/messages')}
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                    {profileUser?.name}
                  </h1>
                  {profileUser?.isImpactPatron && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      HelpLoop Impact Patron 🛡️
                    </span>
                  )}
                </div>
                <p className="text-sm font-mono text-gray-400">@{profileUser?.username}</p>
                {profileUser?.headline && (
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {profileUser.headline}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                {profileUser?.bio || 'Active participant and mutual aid supporter on HelpLoop.'}
              </p>

              {/* Causes / Interests Badges */}
              {profileUser?.sharedInterests && profileUser.sharedInterests.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> Causes:
                  </span>
                  {profileUser.sharedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                {profileUser?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {profileUser.location}
                  </span>
                )}
                {profileUser?.website && (
                  <a
                    href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> {profileUser.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {profileUser?.twitter && (
                  <span className="flex items-center gap-1 text-blue-500">
                    <span className="font-bold">𝕏</span> {profileUser.twitter}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined {profileUser?.joinedDate || '2024'}
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <Award className="w-3.5 h-3.5" /> {isCurrentUser ? goodnessPoints : profileUser?.goodnessPoints || 1200} Goodness Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          {[
            { id: 'posts', label: 'Community Posts' },
            { id: 'badges', label: 'Milestone Badges' },
            { id: 'contributions', label: 'Contribution History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Posts */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-3"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{post.caption}</p>
                  {post.mediaUrls && post.mediaUrls[0] && (
                    <img
                      src={post.mediaUrls[0]}
                      alt="Post media"
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No community posts yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Badges */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {DEMO_BADGES.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 text-center space-y-2 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                  🏅
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{b.name}</h4>
                <p className="text-xs text-gray-400">{b.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Contributions */}
        {activeTab === 'contributions' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Recent Simulated Contributions</h3>
            {demoTransactions.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm"
              >
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{tx.recipientName}</p>
                  <p className="text-xs text-gray-400 font-mono">{tx.id}</p>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
