import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Repeat } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';

interface MobileHeaderProps {
  className?: string;
}

const routeTitles: Record<string, string> = {
  '/': 'HelpLoop',
  '/home': 'HelpLoop',
  '/explore': 'Explore Causes',
  '/donate': 'Help & Donate',
  '/circles': 'HelpCircles',
  '/messages': 'Messages',
  '/events': 'Community Events',
  '/notifications': 'Notifications',
  '/saved': 'Saved Posts',
  '/contributions': 'My Contributions',
  '/requests': 'My Requests',
  '/impact-passport': 'Impact Passport',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/create': 'New Post',
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { unreadNotifications } = useAppStore();

  const getPageTitle = (pathname: string): string => {
    if (routeTitles[pathname]) return routeTitles[pathname];
    const segment = pathname.split('/').filter(Boolean)[0];
    if (!segment) return 'HelpLoop';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  const currentTitle = getPageTitle(location.pathname);
  const isHome = location.pathname === '/' || location.pathname === '/home';

  const handleSearchClick = () => {
    navigate('/explore');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full lg:hidden',
        'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md',
        'border-b border-gray-100 dark:border-gray-800/80',
        'px-4 py-3 flex items-center justify-between',
        className
      )}
    >
      {/* Left: Brand or Page Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="HelpLoop Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <Repeat className="w-4 h-4" />
          </div>
          {isHome ? (
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              Help<span className="text-emerald-500">Loop</span>
            </span>
          ) : null}
        </button>

        {!isHome && (
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate pl-1 border-l border-gray-200 dark:border-gray-700">
            {currentTitle}
          </h1>
        )}
      </div>

      {/* Right Actions: Search, Notifications, Avatar */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Search */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Search causes and people"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotificationsClick}
          className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse">
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          )}
        </button>

        {/* Avatar */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="ml-1 rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="View profile"
        >
          <Avatar
            size="sm"
            name={user?.name || 'Guest User'}
            src={user?.avatarUrl}
            isOnline={user?.isOnline}
          />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
