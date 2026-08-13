'use client';

import React from 'react';
import { CourseHierarchyResponse, SkillHierarchy } from '@/types';
import { UnitSection } from './UnitSection';

export interface LearningPathProps {
  course: CourseHierarchyResponse;
  onSkillClick: (skill: SkillHierarchy) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ course, onSkillClick }) => {
  if (!course || !course.units || course.units.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-500">No learning path units found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-md mx-auto">
      {course.units.map((unit) => (
        <UnitSection key={unit.id} unit={unit} onSkillClick={onSkillClick} />
      ))}
    </div>
  );
};
