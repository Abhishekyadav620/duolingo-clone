'use client';

import React from 'react';
import { UnitHierarchy, SkillHierarchy } from '@/types';
import { SkillNode } from './SkillNode';
import { BookOpen } from 'lucide-react';

export interface UnitSectionProps {
  unit: UnitHierarchy;
  onSkillClick: (skill: SkillHierarchy) => void;
}

export const UnitSection: React.FC<UnitSectionProps> = ({ unit, onSkillClick }) => {
  // Serpentine zig-zag offset pattern for playful Duolingo skill tree layout
  const offsetClasses = [
    'translate-x-0',                      // node 0: centered
    '-translate-x-12 sm:-translate-x-16', // node 1: shifted left
    'translate-x-12 sm:translate-x-16',   // node 2: shifted right
    'translate-x-0',                      // node 3: centered
  ];

  // Unit theme colors based on order
  const unitTheme = (order: number) => {
    switch (order % 3) {
      case 1:
        return 'bg-[#58CC02] border-[#46A302] text-white shadow-emerald-500/20';
      case 2:
        return 'bg-[#1CB0F6] border-[#0092DF] text-white shadow-sky-500/20';
      case 0:
      default:
        return 'bg-[#CE82FF] border-[#B25BF6] text-white shadow-purple-600/20';
    }
  };

  return (
    <section className="space-y-6">
      {/* Unit Header Banner */}
      <div className={`p-6 rounded-3xl border-b-4 shadow-lg ${unitTheme(unit.order)}`}>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-90 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Unit {unit.order}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">{unit.title}</h2>
        <p className="text-sm opacity-90 mt-1">{unit.description}</p>
      </div>

      {/* Skill Path Container with Connectors */}
      <div className="relative flex flex-col items-center py-4">
        {/* Vertical Center Connector Line */}
        <div className="absolute top-4 bottom-4 w-2 bg-zinc-200 dark:bg-zinc-800 rounded-full -z-0" />

        {unit.skills.map((skill, index) => {
          const offset = offsetClasses[index % offsetClasses.length];
          return (
            <div key={skill.id} className="relative z-10 my-3">
              <SkillNode skill={skill} onClick={onSkillClick} offsetClass={offset} />
            </div>
          );
        })}
      </div>
    </section>
  );
};
