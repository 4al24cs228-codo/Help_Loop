import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Plus, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCreatePostModal } = useAppStore();

  const isCurrent = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    isSpecial?: boolean;
    onClick?: () => void;
  }

  const navItems: NavItem[] = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      badge: undefined,
    },
    {
      label: 'Explore',
      path: '/explore',
      icon: Compass,
      badge: undefined,
    },
    {
      label: 'Create',
      path: '/create',
      icon: Plus,
      isSpecial: true,
      onClick: () => {
        openCreatePostModal();
      },
    },
    {
      label: 'Circles',
      path: '/helpcircles',
      icon: Users,
      badge: undefined,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      badge: undefined,
    },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 lg:hidden',
        'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md',
        'border-t border-gray-200/80 dark:border-gray-800',
        'pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] pt-1 px-3',
        'shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)]',
        className
      )}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = !item.isSpecial && isCurrent(item.path);

          if (item.isSpecial) {
            return (
              <div key="nav-create" className="relative -top-4 flex flex-col items-center">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={item.onClick || (() => navigate(item.path))}
                  className={cn(
                    'w-13 h-13 rounded-full',
                    'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400',
                    'text-white shadow-lg shadow-emerald-500/35',
                    'flex items-center justify-center p-3.5',
                    'border-4 border-white dark:border-gray-900',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer'
                  )}
                  aria-label="Create Post or Request"
                >
                  <Plus className="w-6 h-6 stroke-[2.75]" />
                </motion.button>
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                  Create
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                active
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    active && 'scale-110 stroke-[2.4]'
                  )}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>

              {/* Active Indicator dot */}
              {active && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
