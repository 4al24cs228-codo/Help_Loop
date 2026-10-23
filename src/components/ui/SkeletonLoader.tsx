import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

/**
 * Base shimmer block
 */
export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  width,
  height,
  style,
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-200 dark:bg-gray-800/80',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/10 before:to-transparent',
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Circular avatar skeleton
 */
export const CircleSkeleton: React.FC<{ size?: number | string; className?: string }> = ({
  size = 40,
  className,
}) => (
  <SkeletonLoader
    variant="circular"
    width={size}
    height={size}
    className={cn('flex-shrink-0', className)}
  />
);

/**
 * Feed post skeleton placeholder
 */
export const PostSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/90 rounded-2xl p-5 shadow-card space-y-4',
        className
      )}
    >
      {/* Header: Avatar + User Info */}
      <div className="flex items-center gap-3">
        <CircleSkeleton size={42} />
        <div className="space-y-1.5 flex-1">
          <SkeletonLoader height={14} width="35%" />
          <SkeletonLoader height={10} width="20%" />
        </div>
        <SkeletonLoader height={18} width={24} variant="circular" />
      </div>

      {/* Content lines */}
      <div className="space-y-2 pt-1">
        <SkeletonLoader height={12} width="96%" />
        <SkeletonLoader height={12} width="88%" />
        <SkeletonLoader height={12} width="60%" />
      </div>

      {/* Media placeholder */}
      <SkeletonLoader height={210} className="w-full rounded-2xl" />

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60">
        <div className="flex gap-4">
          <SkeletonLoader height={24} width={50} />
          <SkeletonLoader height={24} width={50} />
          <SkeletonLoader height={24} width={50} />
        </div>
        <SkeletonLoader height={24} width={28} />
      </div>
    </div>
  );
};

/**
 * Impact campaign / category card skeleton
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-card flex flex-col',
        className
      )}
    >
      {/* Card Image */}
      <SkeletonLoader height={160} variant="rectangular" className="w-full" />

      <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Badge & Meta */}
          <div className="flex items-center justify-between">
            <SkeletonLoader height={18} width={75} />
            <SkeletonLoader height={12} width={50} />
          </div>

          {/* Title */}
          <SkeletonLoader height={18} width="80%" />
          <SkeletonLoader height={12} width="100%" />
          <SkeletonLoader height={12} width="65%" />
        </div>

        {/* Progress Bar & Footer */}
        <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-gray-800/60">
          <div className="flex justify-between items-center">
            <SkeletonLoader height={12} width={60} />
            <SkeletonLoader height={12} width={40} />
          </div>
          <SkeletonLoader height={8} className="w-full rounded-full" />
          <div className="flex items-center justify-between pt-1">
            <div className="flex -space-x-1.5">
              <CircleSkeleton size={20} />
              <CircleSkeleton size={20} />
              <CircleSkeleton size={20} />
            </div>
            <SkeletonLoader height={28} width={76} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * User Profile skeleton placeholder
 */
export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-card',
        className
      )}
    >
      {/* Cover Banner */}
      <SkeletonLoader height={140} variant="rectangular" className="w-full" />

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar positioned over banner */}
        <div className="-mt-12 mb-3">
          <SkeletonLoader
            variant="circular"
            width={84}
            height={84}
            className="ring-4 ring-white dark:ring-gray-900"
          />
        </div>

        {/* User name & role */}
        <div className="space-y-2">
          <SkeletonLoader height={22} width={180} />
          <SkeletonLoader height={14} width={120} />
          <SkeletonLoader height={12} width="80%" />
          <SkeletonLoader height={12} width="60%" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 my-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="text-center space-y-1">
            <SkeletonLoader height={18} width="50%" className="mx-auto" />
            <SkeletonLoader height={10} width="70%" className="mx-auto" />
          </div>
          <div className="text-center space-y-1 border-x border-gray-200 dark:border-gray-700">
            <SkeletonLoader height={18} width="50%" className="mx-auto" />
            <SkeletonLoader height={10} width="70%" className="mx-auto" />
          </div>
          <div className="text-center space-y-1">
            <SkeletonLoader height={18} width="50%" className="mx-auto" />
            <SkeletonLoader height={10} width="70%" className="mx-auto" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
          <SkeletonLoader height={24} width={80} />
          <SkeletonLoader height={24} width={80} />
          <SkeletonLoader height={24} width={80} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
