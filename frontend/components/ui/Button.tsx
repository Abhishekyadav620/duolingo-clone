'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'locked';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-extrabold tracking-wide uppercase transition-all rounded-2xl border-b-4 active:border-b-2 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs border-b-[3px]',
    md: 'px-5 py-2.5 text-sm border-b-4',
    lg: 'px-6 py-3.5 text-base border-b-[5px]',
  };

  const variantStyles = {
    primary: 'btn-3d-green',
    secondary: 'btn-3d-blue',
    accent: 'bg-[#CE82FF] hover:bg-[#D696FF] text-white border-[#B25BF6]',
    outline: 'btn-3d-white',
    ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-transparent border-b-0 shadow-none',
    danger: 'btn-3d-red',
    locked: 'bg-[#E5E5E5] dark:bg-zinc-800 text-[#AFAFAF] dark:text-zinc-500 border-[#CECECE] dark:border-zinc-700 border-b-4 cursor-not-allowed',
  };

  const selectedVariant = disabled || variant === 'locked' ? variantStyles.locked : variantStyles[variant];

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled || variant === 'locked'}
      className={`${baseStyles} ${sizeStyles[size]} ${selectedVariant} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
