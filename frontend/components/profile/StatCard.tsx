'use client';

import React from 'react';

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  colorClass = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
}) => {
  return (
    <div className={`p-5 rounded-3xl border shadow-xs space-y-2 transition-all hover:scale-[1.02] ${colorClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-zinc-400 font-semibold truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
