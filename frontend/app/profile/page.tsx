'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatCard } from '@/components/profile/StatCard';
import { ProgressOverview } from '@/components/profile/ProgressOverview';
import { SkillStats } from '@/components/profile/SkillStats';
import { AchievementCard } from '@/components/profile/AchievementCard';
import { DailyGoal } from '@/components/gamification/DailyGoal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';

import { getProfile, getProgress } from '@/lib/api';
import { ProfileResponse, ProgressResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import {
  Flame,
  Star,
  Trophy,
  BookOpen,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [progressData, setProgressData] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prof, prog] = await Promise.all([
        getProfile(),
        getProgress()
      ]);
      setProfileData(prof);
      setProgressData(prog);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Unable to load profile data.');
      } else {
        setError('Unable to load profile data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const [prof, prog] = await Promise.all([
          getProfile(),
          getProgress()
        ]);
        if (!ignore) {
          setProfileData(prof);
          setProgressData(prog);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof Error) {
            setError(err.message || 'Unable to load profile data.');
          } else {
            setError('Unable to load profile data.');
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {loading ? (
          <LoadingSkeleton />
        ) : error || !profileData ? (
          <div className="max-w-md mx-auto my-16 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Unable to load profile</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{error || 'Network request failed.'}</p>
            <Button variant="primary" onClick={loadData} fullWidth>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Banner Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <ProfileHeader user={profileData.user} />
              </div>
              <div className="shrink-0">
                <Button
                  variant="danger"
                  size="md"
                  onClick={async () => {
                    await logout();
                    router.push('/login');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>

            {/* Stat Card Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Flame className="w-5 h-5 text-orange-500 fill-orange-400" />}
                title="Streak"
                value={`${profileData.user.streak} Days`}
                subtitle="Daily learning streak"
              />
              <StatCard
                icon={<Star className="w-5 h-5 text-amber-500 fill-amber-400" />}
                title="Total XP"
                value={`${profileData.user.xp}`}
                subtitle="Lifetime experience points"
              />
              <StatCard
                icon={<Trophy className="w-5 h-5 text-emerald-500" />}
                title="Skills Done"
                value={`${profileData.stats.completed_skills} / ${profileData.stats.total_skills}`}
                subtitle="Skills mastered"
              />
              <StatCard
                icon={<BookOpen className="w-5 h-5 text-purple-500" />}
                title="Lessons Done"
                value={`${profileData.stats.completed_lessons} / ${profileData.stats.total_lessons}`}
                subtitle="Lessons finished"
              />
            </div>

            {/* Two-Column Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Progress & Skills */}
              <div className="lg:col-span-2 space-y-6">
                <ProgressOverview
                  completedSkills={profileData.stats.completed_skills}
                  totalSkills={profileData.stats.total_skills}
                  completedLessons={profileData.stats.completed_lessons}
                  totalLessons={profileData.stats.total_lessons}
                />

                {progressData && (
                  <SkillStats skills={progressData.skills_progress} />
                )}
              </div>

              {/* Right Column: Daily Goal Widget */}
              <aside className="space-y-6">
                <DailyGoal
                  currentXP={profileData.user.xp}
                  dailyGoal={profileData.user.daily_goal}
                />
              </aside>
            </div>

            {/* Achievements Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Achievements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileData.achievements.map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
