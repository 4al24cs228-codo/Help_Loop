import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'onClick'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm hover:shadow-md shadow-emerald-500/20 focus-visible:ring-emerald-500 border border-transparent',
  secondary:
    'bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 border border-teal-200/80 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 dark:text-teal-200 dark:border-teal-800 focus-visible:ring-teal-500',
  outline:
    'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus-visible:ring-emerald-500',
  ghost:
    'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white border border-transparent focus-visible:ring-emerald-500',
  danger:
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow-md shadow-red-500/20 focus-visible:ring-red-500 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-5 py-3 text-base font-semibold rounded-2xl gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  children,
  ...props
}) => {
  const isButtonDisabled = disabled || isLoading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isButtonDisabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      disabled={isButtonDisabled}
      onClick={handleClick}
      whileHover={isButtonDisabled ? undefined : { scale: 1.015 }}
      whileTap={isButtonDisabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'relative inline-flex items-center justify-center font-medium transition-colors select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isButtonDisabled && 'opacity-60 cursor-not-allowed pointer-events-none shadow-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children || 'Loading...'}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0 flex items-center">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="flex-shrink-0 flex items-center">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
