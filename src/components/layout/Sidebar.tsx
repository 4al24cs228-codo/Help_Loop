import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Heart,
  PlusCircle,
  Users,
  MessageCircle,
  Calendar,
  Bell,
  Bookmark,
  TrendingUp,
  FileText,
  Award,
  User,
  Settings,
  LogOut,
  Repeat,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    unreadNotifications,
    unreadMessages,
    openCreatePostModal,
  } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isCurrent = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    tag?: string;
    onClick?: () => void;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    {
      name: 'Home',
      path: '/home',
      icon: Home,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: Compass,
    },
    {
      name: 'Donate',
      path: '/donate',
      icon: Heart,
      tag: 'Help Categories',
    },
    {
      name: 'Create Post',
      path: '/create',
      icon: PlusCircle,
      highlight: true,
      onClick: () => {
        openCreatePostModal();
      },
    },
    {
      name: 'HelpCircles',
      path: '/helpcircles',
      icon: Users,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
      badgeVariant: 'success',
    },
    {
      name: 'Events',
      path: '/events',
      icon: Calendar,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
      badgeVariant: 'danger',
    },
    {
      name: 'Saved Posts',
      path: '/saved',
      icon: Bookmark,
    },
    {
      name: 'My Contributions',
      path: '/contributions',
      icon: TrendingUp,
    },
    {
      name: 'My Requests',
      path: '/requests',
      icon: FileText,
    },
    {
      name: 'Impact Passport',
      path: '/impact',
      icon: Award,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
    ...(user?.role === 'admin'
      ? [
          {
            name: 'Admin Review',
            path: '/admin',
            icon: ShieldCheck,
            badge: 'Portal',
            badgeVariant: 'warning' as const,
          },
        ]
      : []),
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col fixed top-0 bottom-0 left-0 w-[280px] z-30',
        'bg-white dark:bg-gray-900',
        'border-r border-gray-200/80 dark:border-gray-800',
        'select-none'
      )}
      aria-label="Desktop sidebar"
    >
      {/* Top Header & Logo */}
      <div className="p-5 pb-4 border-b border-gray-100 dark:border-gray-800/80">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 flex-shrink-0">
            <Repeat className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                Help<span className="text-emerald-500">Loop</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              Social Impact Network
            </span>
          </div>
        </button>
      </div>

      {/* Navigation Items (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isCurrent(item.path);

          return (
            <motion.button
              key={item.name}
              type="button"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  navigate(item.path);
                }
              }}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left cursor-pointer relative group',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                  : item.highlight
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {/* Active Indicator Bar */}
              {active && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    active
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : item.highlight
                        ? 'text-emerald-500'
                        : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {/* Tag or Badge */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.tag && (
                  <Badge variant="success" size="sm" className="text-[10px] py-0 px-2 font-normal">
                    {item.tag}
                  </Badge>
                )}

                {item.badge !== undefined && (
                  <Badge
                    variant={item.badgeVariant || 'default'}
                    size="sm"
                    className="min-w-[20px] h-5 px-1.5 text-[10px] font-bold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* User Card at bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-none hover:shadow-sm border border-transparent hover:border-gray-200/60 dark:hover:border-gray-700/60">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
          >
            <Avatar
              size="md"
              name={user?.name || 'Elena Rostova'}
              src={user?.avatarUrl}
              isOnline={user?.isOnline ?? true}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'Elena Rostova'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                @{user?.username || 'elenarostova'}
                {user?.impactPoints ? (
                  <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                    {user.impactPoints}
                  </span>
                ) : null}
              </span>
            </div>
          </button>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out of HelpLoop"
            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
