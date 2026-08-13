'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { StreakDisplay } from '@/components/gamification/StreakDisplay';
import { XPDisplay } from '@/components/gamification/XPDisplay';
import { HeartsDisplay } from '@/components/gamification/HeartsDisplay';
import { GemsDisplay } from '@/components/gamification/GemsDisplay';
import { DailyGoal } from '@/components/gamification/DailyGoal';
import { LearningPath } from '@/components/learning-path/LearningPath';
import { SkillModal } from '@/components/learning-path/SkillModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/ui/Mascot';

import { getCurrentUser, getCourse, getProgress } from '@/lib/api';
import {
  UserResponse,
  CourseHierarchyResponse,
  ProgressResponse,
  SkillHierarchy
} from '@/types';

import {
  Trophy,
  Dumbbell,
  User as UserIcon,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [course, setCourse] = useState<CourseHierarchyResponse | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);

  const [selectedSkill, setSelectedSkill] = useState<SkillHierarchy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userData, courseData, progressData] = await Promise.all([
        getCurrentUser(),
        getCourse(),
        getProgress()
      ]);
      setUser(userData);
      setCourse(courseData);
      setProgress(progressData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Unable to connect to Django server.');
      } else {
        setError('Unable to connect to Django server.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const [userData, courseData, progressData] = await Promise.all([
          getCurrentUser(),
          getCourse(),
          getProgress()
        ]);
        if (!ignore) {
          setUser(userData);
          setCourse(courseData);
          setProgress(progressData);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof Error) {
            setError(err.message || 'Unable to load your learning path.');
          } else {
            setError('Unable to load your learning path.');
          }
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSkillClick = (skill: SkillHierarchy) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  // Find next lesson ID for selected skill
  const getNextLessonIdForSkill = (skill: SkillHierarchy | null): number => {
    if (!skill || !course) return 1;
    // Walk units & skills to find corresponding skill and its first lesson
    for (const unit of course.units) {
      for (const sk of unit.skills) {
        if (sk.id === skill.id) {
          // Default mapping to lesson order/id
          return skill.id === 1 ? 1 : (skill.id - 1) * 2 + 1;
        }
      }
    }
    return 1;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="max-w-md mx-auto my-16 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Unable to load learning path</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Please check that the Django backend server is running on <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">http://127.0.0.1:8000</code>.
            </p>
            <Button variant="primary" onClick={loadData} fullWidth>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Gamification Bar */}
            {user && (
              <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Mascot mood="happy" size="sm" />
                  <span className="text-sm font-black text-[#58CC02] dark:text-[#58CC02] uppercase tracking-wider">
                    {course?.name || 'Spanish'} Path
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <StreakDisplay streak={user.streak} />
                  <XPDisplay xp={user.xp} />
                  <HeartsDisplay hearts={user.hearts} />
                  <GemsDisplay gems={user.gems} />
                </div>
              </div>
            )}

            {/* Desktop Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left/Center Column: Learning Path */}
              <div className="lg:col-span-2 space-y-6">
                {course ? (
                  <LearningPath course={course} onSkillClick={handleSkillClick} />
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-3xl border">
                    No course available.
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <aside className="space-y-6 lg:sticky lg:top-24">
                {/* Daily Goal Card */}
                {user && (
                  <DailyGoal currentXP={user.xp} dailyGoal={user.daily_goal} />
                )}

                {/* Learner Progress Stats Widget */}
                {progress && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Your Progress</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {progress.stats.completed_skills} / {progress.stats.total_skills}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-semibold">Skills Mastered</div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <div className="text-base font-black text-purple-600 dark:text-purple-400">
                          {progress.stats.completed_lessons} / {progress.stats.total_lessons}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-semibold">Lessons Done</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="font-bold text-xs text-zinc-400 uppercase tracking-wider">Quick Actions</div>
                  <Link href="/practice" className="block">
                    <Button variant="outline" fullWidth size="md">
                      <Dumbbell className="w-4 h-4 mr-2 text-sky-500" />
                      Practice Skills
                    </Button>
                  </Link>
                  <Link href="/profile" className="block">
                    <Button variant="ghost" fullWidth size="md">
                      <UserIcon className="w-4 h-4 mr-2 text-purple-500" />
                      View Profile
                    </Button>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* Skill Interaction Modal */}
      <SkillModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nextLessonId={getNextLessonIdForSkill(selectedSkill)}
        previousSkillTitle="the previous skill"
      />
    </div>
  );
}
