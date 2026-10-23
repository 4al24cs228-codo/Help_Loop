import React from 'react';
import { cn } from '@/lib/utils';

interface HelpLoopLogoProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  textColor?: string;
  badge?: string;
}

export const HelpLoopLogo: React.FC<HelpLoopLogoProps> = ({
  className,
  iconSize = 'md',
  showText = true,
  textClassName,
  textColor,
  badge,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 p-1.5 rounded-lg',
    md: 'w-9 h-9 p-2 rounded-xl',
    lg: 'w-11 h-11 p-2.5 rounded-2xl',
    xl: 'w-14 h-14 p-3 rounded-2xl',
  };

  const textMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200',
          sizeMap[iconSize]
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white"
        >
          {/* Loop / Infinity with heart shape touch */}
          <path d="M18.178 8c5.096 0 5.096 8 0 8-3.058 0-4.587-4-6.178-4s-3.12 4-6.178 4c-5.096 0-5.096-8 0-8 3.058 0 4.587 4 6.178 4s3.12-4 6.178-4z" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'font-black tracking-tight leading-none',
              textMap[iconSize],
              textColor || 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400',
              textClassName
            )}
          >
            HelpLoop
          </span>
          {badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default HelpLoopLogo;
