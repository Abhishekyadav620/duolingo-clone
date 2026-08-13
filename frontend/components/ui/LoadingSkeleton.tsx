'use client';

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8 w-full max-w-4xl mx-auto p-4">
      {/* Header skeleton */}
      <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Path skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-full" />
          <div className="flex flex-col items-center space-y-8 py-6">
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-full" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-full" />
        </div>
      </div>
    </div>
  );
};
