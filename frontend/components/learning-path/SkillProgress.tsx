'use client';

import React from 'react';

export interface SkillProgressProps {
  progress: number; // 0 to 100
  size?: number; // Outer SVG size in px
  strokeWidth?: number;
  children: React.ReactNode;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  children,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track Background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200 dark:text-zinc-800"
          fill="transparent"
        />
        {/* Active Ring */}
        {progress > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-700 ease-out"
            fill="transparent"
          />
        )}
      </svg>
      {/* Centered Node Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
