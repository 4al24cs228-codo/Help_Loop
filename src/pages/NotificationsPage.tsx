import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageSquare,
  Heart,
  Trophy,
  Calendar,
  ShieldCheck,
  Users,
  UserPlus,
  Sparkles,
  Info,
  Mail,
  MailOpen,
  Settings,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAppStore } from '../store/useAppStore';
import { timeAgo, cn } from '../lib/utils';

export interface NotificationItem {
  id: string;
  type:
    | 'comment'
    | 'donation'
    | 'milestone'
    | 'event'
    | 'verification'
    | 'community'
    | 'follow'
    | 'impact'
    | 'system'
    | 'message';
  title: string;
  message: string;
  avatar: string | null;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'comment',
    title: 'Sneha K. commented on your post',
    message: 'Thanks for sharing this amazing story! Every contribution counts. 💚',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop',
    link: '/home',
    isRead: false,
    createdAt: '2026-10-22T10:30:00Z',
  },
  {
    id: 'notif-2',
    type: 'donation',
    title: 'Demo Donation Successful!',
    message:
      '₹500 contributed to "Emergency Heart Surgery for Aarav" (Ref: DEMO-20261022-ABC123)',
    avatar: null,
    link: '/campaign/camp-1',
    isRead: false,
    createdAt: '2026-10-21T18:20:00Z',
  },
  {
    id: 'notif-3',
    type: 'milestone',
    title: 'You earned a badge! 🏆',
    message:
      'You unlocked the "Kindness Starter" badge for your first community contribution!',
    avatar: null,
    link: '/impact',
    isRead: false,
    createdAt: '2026-10-21T18:21:00Z',
  },
  {
    id: 'notif-4',
    type: 'event',
    title: 'Event Reminder: Blood Donation Camp',
    message:
      'Blood Donation Camp at Fortis Hospital is tomorrow! See you at 9 AM.',
    avatar: null,
    link: '/events/evt-2',
    isRead: true,
    createdAt: '2026-10-21T09:00:00Z',
  },
  {
    id: 'notif-5',
    type: 'verification',
    title: 'Request Verified! ✅',
    message:
      'Your submitted request "Educational Support" has been verified by the HelpLoop team.',
    avatar: null,
    link: '/requests',
    isRead: true,
    createdAt: '2026-10-20T14:00:00Z',
  },
  {
    id: 'notif-6',
    type: 'community',
    title: 'New post in Medical Support Group',
    message:
      'Dr. Anita posted: "3 blood donors urgently needed at Kokilaben Hospital, Mumbai."',
    avatar:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=60&auto=format&fit=crop',
    link: '/helpcircles/circle-1',
    isRead: true,
    createdAt: '2026-10-20T11:00:00Z',
  },
  {
    id: 'notif-7',
    type: 'follow',
    title: 'Rahul M. started following you',
    message: 'You now have a new follower on HelpLoop!',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop',
    link: '/profile/rahul_m',
    isRead: true,
    createdAt: '2026-10-19T16:00:00Z',
  },
  {
    id: 'notif-8',
    type: 'impact',
    title: 'Impact Milestone: Level 2 Unlocked!',
    message:
      'Congratulations! You have reached Level 2 — Active Supporter. Keep going! 🌟',
    avatar: null,
    link: '/impact',
    isRead: true,
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'notif-9',
    type: 'system',
    title: 'Welcome to HelpLoop! 🎉',
    message:
      'Your account is set up. Explore campaigns, join communities, and make a difference!',
    avatar: null,
    link: '/home',
    isRead: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'notif-10',
    type: 'message',
    title: 'New Direct Message',
    message:
      'Ananya Sen sent you a message: "Are you attending the Juhu Beach cleanup on Sunday?"',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop',
    link: '/messages',
    isRead: false,
    createdAt: '2026-10-22T11:15:00Z',
  },
];

type FilterTab =
  | 'All'
  | 'Messages'
  | 'Campaigns'
  | 'Communities'
  | 'Events'
  | 'Verification'
  | 'Impact Passport'
  | 'System';

const TABS: FilterTab[] = [
  'All',
  'Messages',
  'Campaigns',
  'Communities',
  'Events',
  'Verification',
  'Impact Passport',
  'System',
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { setUnreadNotifications } = useAppStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  // Preference switches state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [donationReceipts, setDonationReceipts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [communityMentions, setCommunityMentions] = useState(true);

  // Recalculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Sync with global store whenever notifications change
  const syncStoreUnread = (items: NotificationItem[]) => {
    const unread = items.filter((n) => !n.isRead).length;
    setUnreadNotifications(unread);
  };

  // Filtered notifications based on activeTab and showOnlyUnread
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (showOnlyUnread && n.isRead) return false;

      switch (activeTab) {
        case 'Messages':
          return n.type === 'message' || n.type === 'comment';
        case 'Campaigns':
          return n.type === 'donation';
        case 'Communities':
          return n.type === 'community' || n.type === 'follow';
        case 'Events':
          return n.type === 'event';
        case 'Verification':
          return n.type === 'verification';
        case 'Impact Passport':
          return n.type === 'impact' || n.type === 'milestone';
        case 'System':
          return n.type === 'system';
        case 'All':
        default:
          return true;
      }
    });
  }, [notifications, activeTab, showOnlyUnread]);

  // Mark a single notification as read and navigate
  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      const updated = notifications.map((n) =>
        n.id === item.id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      syncStoreUnread(updated);
    }

    if (item.link) {
      navigate(item.link);
    }
  };

  // Toggle read status manually without navigating
  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: !n.isRead } : n
    );
    setNotifications(updated);
    syncStoreUnread(updated);

    const changedItem = updated.find((n) => n.id === id);
    if (changedItem?.isRead) {
      toast.success('Marked as read');
    } else {
      toast('Marked as unread', { icon: '📬' });
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    syncStoreUnread(updated);
    toast.success('All notifications marked as read');
  };

  // Clear all read notifications
  const handleClearRead = () => {
    const unreadItems = notifications.filter((n) => !n.isRead);
    if (unreadItems.length === notifications.length) {
      toast('No read notifications to clear', { icon: 'ℹ️' });
      return;
    }
    setNotifications(unreadItems);
    syncStoreUnread(unreadItems);
    toast.success('Read notifications cleared');
  };

  // Delete a single notification
  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    syncStoreUnread(updated);
    toast.success('Notification removed');
  };

  // Render type icon with customized theme
  const renderNotificationIcon = (item: NotificationItem) => {
    if (item.avatar) {
      return (
        <Avatar
          name={item.title}
          src={item.avatar}
          size="md"
          className="flex-shrink-0"
        />
      );
    }

    const iconConfigs: Record<
      NotificationItem['type'],
      { bg: string; text: string; icon: React.ReactNode }
    > = {
      comment: {
        bg: 'bg-blue-100 dark:bg-blue-950/60',
        text: 'text-blue-600 dark:text-blue-400',
        icon: <MessageSquare className="w-5 h-5" />,
      },
      message: {
        bg: 'bg-cyan-100 dark:bg-cyan-950/60',
        text: 'text-cyan-600 dark:text-cyan-400',
        icon: <Mail className="w-5 h-5" />,
      },
      donation: {
        bg: 'bg-emerald-100 dark:bg-emerald-950/60',
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: <Heart className="w-5 h-5" />,
      },
      milestone: {
        bg: 'bg-amber-100 dark:bg-amber-950/60',
        text: 'text-amber-600 dark:text-amber-400',
        icon: <Trophy className="w-5 h-5" />,
      },
      event: {
        bg: 'bg-teal-100 dark:bg-teal-950/60',
        text: 'text-teal-600 dark:text-teal-400',
        icon: <Calendar className="w-5 h-5" />,
      },
      verification: {
        bg: 'bg-emerald-100 dark:bg-emerald-950/60',
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: <ShieldCheck className="w-5 h-5" />,
      },
      community: {
        bg: 'bg-indigo-100 dark:bg-indigo-950/60',
        text: 'text-indigo-600 dark:text-indigo-400',
        icon: <Users className="w-5 h-5" />,
      },
      follow: {
        bg: 'bg-violet-100 dark:bg-violet-950/60',
        text: 'text-violet-600 dark:text-violet-400',
        icon: <UserPlus className="w-5 h-5" />,
      },
      impact: {
        bg: 'bg-yellow-100 dark:bg-yellow-950/60',
        text: 'text-yellow-600 dark:text-yellow-400',
        icon: <Sparkles className="w-5 h-5" />,
      },
      system: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-300',
        icon: <Bell className="w-5 h-5" />,
      },
    };

    const config = iconConfigs[item.type] || iconConfigs.system;

    return (
      <div
        className={cn(
          'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner',
          config.bg,
          config.text
        )}
      >
        {config.icon}
      </div>
    );
  };

  // Tab counts for badge preview
  const getTabCount = (tab: FilterTab) => {
    if (tab === 'All') return notifications.length;
    return notifications.filter((n) => {
      switch (tab) {
        case 'Messages':
          return n.type === 'message' || n.type === 'comment';
        case 'Campaigns':
          return n.type === 'donation';
        case 'Communities':
          return n.type === 'community' || n.type === 'follow';
        case 'Events':
          return n.type === 'event';
        case 'Verification':
          return n.type === 'verification';
        case 'Impact Passport':
          return n.type === 'impact' || n.type === 'milestone';
        case 'System':
          return n.type === 'system';
        default:
          return false;
      }
    }).length;
  };

  // Custom empty states per tab
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'Messages':
        return {
          title: 'No Message Notifications',
          desc: 'Direct messages from organizers and comments on your impact posts will show up here.',
          icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
        };
      case 'Campaigns':
        return {
          title: 'No Campaign Activity',
          desc: 'Updates about your donations, recurring pledges, and cause milestones will appear here.',
          icon: <Heart className="w-8 h-8 text-emerald-500" />,
        };
      case 'Communities':
        return {
          title: 'No Circle Updates',
          desc: 'Discussions from your joined HelpCircles and new community followers will appear here.',
          icon: <Users className="w-8 h-8 text-indigo-500" />,
        };
      case 'Events':
        return {
          title: 'No Event Alerts',
          desc: 'Reminders for your registered volunteer drives and waitlist updates will appear here.',
          icon: <Calendar className="w-8 h-8 text-teal-500" />,
        };
      case 'Verification':
        return {
          title: 'No Verification Notices',
          desc: 'Status updates on your submitted beneficiary documents and request reviews will arrive here.',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
        };
      case 'Impact Passport':
        return {
          title: 'No Milestones Yet',
          desc: 'Badges earned, level advancements, and certificate issues will be highlighted here.',
          icon: <Trophy className="w-8 h-8 text-amber-500" />,
        };
      case 'System':
        return {
          title: 'All Systems Normal',
          desc: 'HelpLoop platform releases, security updates, and feature alerts appear here.',
          icon: <Info className="w-8 h-8 text-gray-500" />,
        };
      case 'All':
      default:
        return {
          title: 'You are all caught up!',
          desc: 'There are no active notifications to display. Check back after participating in drives!',
          icon: <Bell className="w-8 h-8 text-emerald-500" />,
        };
    }
  };

  const emptyState = getEmptyStateContent();

  return (
    <AppLayout containerClassName="max-w-4xl">
      <div className="space-y-6 pb-12">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Stay in the loop with impact updates, circle discussions, and volunteer drives.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              leftIcon={<CheckCheck className="w-4 h-4 text-emerald-500" />}
              title="Mark all notifications as read"
            >
              Mark all read
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearRead}
              disabled={notifications.filter((n) => n.isRead).length === 0}
              leftIcon={<Trash2 className="w-4 h-4 text-gray-400" />}
              title="Clear read notifications"
            >
              Clear read
            </Button>

            <button
              type="button"
              onClick={() => setIsPreferencesModalOpen(true)}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Scrollable Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const count = getTabCount(tab);

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150',
                    isActive
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <span>{tab}</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Toggle: Show Only Unread */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 flex-shrink-0">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOnlyUnread}
                onChange={(e) => setShowOnlyUnread(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-gray-700"
              />
              <span>Unread only</span>
            </label>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif, idx) => {
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    'group cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 relative overflow-hidden',
                    notif.isRead
                      ? 'bg-white dark:bg-gray-900 border-gray-200/70 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50 shadow-sm hover:border-emerald-400'
                  )}
                >
                  {/* Left unread vertical indicator line */}
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  )}

                  {/* Left Avatar / Icon */}
                  {renderNotificationIcon(notif)}

                  {/* Main Notification Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {notif.title}
                      </span>

                      {/* Notification type tag */}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {notif.type}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                      <span>{timeAgo(notif.createdAt)}</span>
                      <span>•</span>
                      <span className="hover:text-emerald-600 transition-colors flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        View details <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Right Action Icons & Unread Indicator */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-1"
                        title="Unread notification"
                      />
                    )}

                    {/* Toggle Read/Unread */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(notif.id, e)}
                      title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                      className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {notif.isRead ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                    </button>

                    {/* Delete item */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(notif.id, e)}
                      title="Remove notification"
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-80 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto shadow-inner">
              {emptyState.icon}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {emptyState.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {emptyState.desc}
              </p>
            </div>

            {activeTab !== 'All' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('All');
                  setShowOnlyUnread(false);
                }}
              >
                View all notifications
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Preferences / Settings Modal */}
      <Modal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        title="Notification Preferences"
        description="Configure which updates you want to receive across HelpLoop."
        size="md"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                Instant Email Notifications
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Receive summaries when someone comments or messages you.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                Donation & Boost Receipts
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Get notified whenever a simulated contribution completes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={donationReceipts}
              onChange={(e) => setDonationReceipts(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                Event Reminders
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Alerts 24 hours prior to registered community initiatives.
              </span>
            </div>
            <input
              type="checkbox"
              checked={eventReminders}
              onChange={(e) => setEventReminders(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                HelpCircles Mentions
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Receive alerts when organizers post urgent requests.
              </span>
            </div>
            <input
              type="checkbox"
              checked={communityMentions}
              onChange={(e) => setCommunityMentions(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Notification preferences saved!');
                setIsPreferencesModalOpen(false);
              }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
