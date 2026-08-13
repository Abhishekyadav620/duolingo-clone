'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'flat' | 'hover';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm',
    flat: 'bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800',
    hover: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer',
  };

  return (
    <div className={`rounded-3xl p-6 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};
