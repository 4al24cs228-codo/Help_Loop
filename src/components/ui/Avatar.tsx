import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hasStory?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
  alt?: string;
}

const sizeConfig: Record<
  NonNullable<AvatarProps['size']>,
  { container: string; text: string; indicator: string; ringPadding: string }
> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px] font-semibold',
    indicator: 'w-1.5 h-1.5 border-[1px]',
    ringPadding: 'p-[1.5px]',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs font-semibold',
    indicator: 'w-2 h-2 border-[1.5px]',
    ringPadding: 'p-[2px]',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-sm font-semibold',
    indicator: 'w-2.5 h-2.5 border-2',
    ringPadding: 'p-[2px]',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-base font-semibold',
    indicator: 'w-3 h-3 border-2',
    ringPadding: 'p-[2.5px]',
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-xl font-bold',
    indicator: 'w-3.5 h-3.5 border-2',
    ringPadding: 'p-[3px]',
  },
};

/**
 * Derives initials from a given full name or single word
 */
function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministically pick an emerald/teal/blue gradient for the avatar fallback
 */
const gradients = [
  'from-emerald-500 to-teal-600',
  'from-teal-500 to-blue-600',
  'from-emerald-600 to-teal-700',
  'from-blue-600 to-teal-500',
  'from-emerald-400 to-cyan-600',
];

function getGradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
  hasStory = false,
  isOnline = false,
  onClick,
  alt,
}) => {
  const [hasError, setHasError] = useState(false);
  const currentSize = sizeConfig[size];
  const initials = getInitials(name);
  const gradientClass = getGradientForName(name);

  const showImage = Boolean(src) && !hasError;

  const avatarContent = (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden select-none flex-shrink-0 transition-transform duration-200',
        currentSize.container,
        showImage ? 'bg-gray-100 dark:bg-gray-800' : cn('bg-gradient-to-br text-white shadow-inner', gradientClass),
        onClick && 'cursor-pointer hover:opacity-95 active:scale-95',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={alt || name}
    >
      {showImage ? (
        <img
          src={src || ''}
          alt={alt || name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
      ) : (
        <span className={cn('tracking-wider drop-shadow-sm', currentSize.text)}>
          {initials}
        </span>
      )}
    </div>
  );

  // If wrapped in story ring or has online indicator
  if (hasStory || isOnline) {
    return (
      <div className={cn('relative inline-flex flex-shrink-0 items-center justify-center', onClick && 'cursor-pointer')}>
        {hasStory ? (
          <div
            className={cn(
              'rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500',
              currentSize.ringPadding
            )}
          >
            <div className="rounded-full bg-white dark:bg-gray-950 p-[1.5px]">
              {avatarContent}
            </div>
          </div>
        ) : (
          avatarContent
        )}

        {isOnline && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full bg-emerald-500 border-white dark:border-gray-900 ring-1 ring-white/50 dark:ring-gray-900/50',
              currentSize.indicator
            )}
            title="Online now"
            aria-label="Online status: active"
          />
        )}
      </div>
    );
  }

  return avatarContent;
};

export default Avatar;
