import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, Heart, Calendar, Award, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { cn, formatINR, timeAgo } from '../lib/utils';
import toast from 'react-hot-toast';

export default function MyContributionsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { demoTransactions, goodnessPoints } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'donations' | 'events' | 'community'>('all');

  const totalDonated = demoTransactions
    .filter(tx => tx.status === 'successful')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const tabs = [
    { id: 'all', label: 'All Activity' },
    { id: 'donations', label: 'Donations' },
    { id: 'events', label: 'Events' },
    { id: 'community', label: 'Community' },
  ] as const;

  const communityActivities = [
    { id: 'act-1', type: 'event', title: 'Joined Beach Cleanup Drive', points: 100, date: '2026-10-19T07:00:00Z', icon: '🌊' },
    { id: 'act-2', type: 'community', title: 'Joined Education for All HelpCircle', points: 50, date: '2026-10-18T12:00:00Z', icon: '👥' },
    { id: 'act-3', type: 'post', title: 'Shared a community story', points: 25, date: '2026-10-17T09:00:00Z', icon: '📢' },
    { id: 'act-4', type: 'comment', title: 'Commented on a campaign', points: 10, date: '2026-10-16T15:00:00Z', icon: '💬' },
  ];

  const allActivities = [
    ...demoTransactions.map(tx => ({
      id: tx.id,
      type: 'donation' as const,
      title: `Donated to ${tx.recipientName}`,
      subtitle: `Transaction ID: ${tx.id}`,
      amount: tx.amount,
      points: Math.max(50, Math.floor(tx.amount / 10)),
      date: tx.created_at,
      status: tx.status,
      isDemo: tx.isDemo,
    })),
    ...communityActivities.map(a => ({
      id: a.id,
      type: a.type as any,
      title: a.title,
      subtitle: '',
      amount: 0,
      points: a.points,
      date: a.date,
      status: 'completed' as const,
      isDemo: false,
      icon: a.icon,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredActivities = activeTab === 'all'
    ? allActivities
    : activeTab === 'donations'
    ? allActivities.filter(a => a.type === 'donation')
    : activeTab === 'events'
    ? allActivities.filter(a => a.type === 'event')
    : allActivities.filter(a => a.type === 'community' || a.type === 'post' || a.type === 'comment');

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Contributions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your impact journey and contribution history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Demo Donated', value: formatINR(totalDonated), icon: <IndianRupee className="w-5 h-5" />, color: 'emerald', sub: 'Simulated contributions' },
            { label: 'Goodness Points', value: goodnessPoints.toLocaleString(), icon: <Award className="w-5 h-5" />, color: 'amber', sub: 'Earned total' },
            { label: 'Campaigns Supported', value: String(new Set(demoTransactions.map(t => t.recipientId)).size), icon: <Heart className="w-5 h-5" />, color: 'rose', sub: 'Unique campaigns' },
            { label: 'Activities Done', value: String(communityActivities.length + demoTransactions.length), icon: <TrendingUp className="w-5 h-5" />, color: 'blue', sub: 'Total activities' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                stat.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                stat.color === 'rose' ? 'bg-rose-100 text-rose-600' :
                'bg-blue-100 text-blue-600'
              )}>
                {stat.icon}
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">{stat.label}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Demo Mode Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>DEMO MODE</strong> — All monetary contributions shown here are simulated for demonstration purposes. No real money was transferred.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No activities in this category yet</p>
              <Button variant="primary" className="mt-4" onClick={() => navigate('/donate')}>
                Start Contributing
              </Button>
            </div>
          ) : (
            filteredActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Icon/Avatar */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    activity.type === 'donation' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'event' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  )}>
                    {activity.type === 'donation' ? (
                      <IndianRupee className="w-5 h-5" />
                    ) : (
                      <span className="text-xl">{(activity as any).icon || '⭐'}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{activity.title}</p>
                    {activity.subtitle && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{activity.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(activity.date)}</p>
                  </div>

                  {/* Right: Amount + Points */}
                  <div className="text-right flex-shrink-0">
                    {activity.amount > 0 && (
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {activity.status === 'successful' ? '+' : ''}{formatINR(activity.amount)}
                      </p>
                    )}
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                      +{activity.points} pts
                    </p>
                    {activity.isDemo && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">
                        DEMO
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Export section */}
        {filteredActivities.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Contribution History</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Download a summary of your activities</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => toast.success('Contribution history export coming soon!')}
            >
              Export PDF
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
