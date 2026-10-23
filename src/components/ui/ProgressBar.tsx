import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export type ProgressBarColor = 'emerald' | 'teal' | 'blue' | 'amber' | 'rose';
export type ProgressBarHeight = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  color?: ProgressBarColor;
  height?: ProgressBarHeight;
  label?: string;
  className?: string;
  ariaLabel?: string;
}

const colorStyles: Record<ProgressBarColor, { bar: string; label: string }> = {
  emerald: {
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    label: 'text-emerald-700 dark:text-emerald-400',
  },
  teal: {
    bar: 'bg-gradient-to-r from-teal-500 to-emerald-400',
    label: 'text-teal-700 dark:text-teal-400',
  },
  blue: {
    bar: 'bg-gradient-to-r from-blue-500 to-teal-400',
    label: 'text-blue-700 dark:text-blue-400',
  },
  amber: {
    bar: 'bg-gradient-to-r from-amber-500 to-orange-400',
    label: 'text-amber-700 dark:text-amber-400',
  },
  rose: {
    bar: 'bg-gradient-to-r from-rose-500 to-red-400',
    label: 'text-rose-700 dark:text-rose-400',
  },
};

const heightStyles: Record<ProgressBarHeight, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  color = 'emerald',
  height = 'md',
  label,
  className,
  ariaLabel = 'Progress indicator',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const currentHeight = heightStyles[height];
  const currentColor = colorStyles[color];

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-600 dark:text-gray-400">{label || 'Progress'}</span>
          {showLabel && (
            <span className={cn('font-bold', currentColor.label)}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={cn(
          'w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-200/50 dark:border-gray-700/50',
          currentHeight
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <motion.div
          className={cn('h-full rounded-full transition-all duration-300', currentColor.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
