'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

import { getLeaderboard, getCurrentUser } from '@/lib/api';
import { LeaderboardEntry, UserResponse } from '@/types';

import { Trophy, Star, Flame, AlertTriangle, RefreshCw, Medal, Radio } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRealtimeLeaderboard = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const [lbRes, userRes] = await Promise.all([
        getLeaderboard(),
        getCurrentUser()
      ]);
      setLeaderboard(lbRes.leaderboard || []);
      setCurrentUser(userRes);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      if (isInitial) {
        if (err instanceof Error) {
          setError(err.message || 'Unable to load live leaderboard data.');
        } else {
          setError('Unable to load live leaderboard data.');
        }
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Set up real-time 3-second polling interval for live rankings
  useEffect(() => {
    let ignore = false;

    async function init() {
      if (!ignore) {
        await fetchRealtimeLeaderboard(true);
      }
    }

    init();

    const interval = setInterval(() => {
      if (!ignore) {
        fetchRealtimeLeaderboard(false);
      }
    }, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [fetchRealtimeLeaderboard]);

  // Top 3 entries
  const topThree = leaderboard.slice(0, 3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: '🥇 1st', color: 'bg-amber-400 border-amber-500 text-amber-950 shadow-amber-400/30' };
    if (rank === 2) return { label: '🥈 2nd', color: 'bg-zinc-300 border-zinc-400 text-zinc-900 shadow-zinc-300/30' };
    if (rank === 3) return { label: '🥉 3rd', color: 'bg-amber-700 border-amber-800 text-amber-100 shadow-amber-700/30' };
    return { label: `#${rank}`, color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700' };
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black px-4 py-1.5 rounded-full border border-amber-300 dark:border-amber-800 uppercase tracking-widest">
              <Trophy className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Learner Rankings</span>
            </div>

            {/* Real-time Live Indicator */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <Radio className="w-3.5 h-3.5" />
              <span>Real-Time Sync</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Leaderboard
          </h1>
          <p className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-2">
            <span>Earn XP by completing lessons to climb the live ranks!</span>
            <span className="text-[10px] font-mono text-zinc-500">
              (Updated {lastUpdated.toLocaleTimeString()})
            </span>
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="max-w-md mx-auto my-12 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Unable to load leaderboard</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{error}</p>
            <Button variant="primary" onClick={() => fetchRealtimeLeaderboard(true)} fullWidth>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <Medal className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-200">No leaderboard data yet</h3>
            <p className="text-xs text-zinc-400">Keep learning to earn your first XP and claim the top rank!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top 3 Podium Section */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-4 max-w-xl mx-auto">
                {/* 2nd Place */}
                {topThree[1] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-zinc-200 dark:bg-zinc-800 border-4 border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-2xl font-black text-zinc-700 dark:text-zinc-300 shadow-md">
                      {(topThree[1].username || '2')[0].toUpperCase()}
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full text-center">
                      <span className="text-[10px] font-black uppercase text-zinc-400 block truncate">🥈 2nd</span>
                      <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate block">
                        {topThree[1].name || topThree[1].username}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-500 block">{topThree[1].xp} XP</span>
                    </div>
                  </motion.div>
                ) : <div />}

                {/* 1st Place */}
                {topThree[0] && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-2 -translate-y-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-4 border-amber-500 flex items-center justify-center text-3xl font-black text-amber-950 shadow-xl shadow-amber-400/30">
                      {(topThree[0].username || '1')[0].toUpperCase()}
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 w-full text-center shadow-sm">
                      <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 block truncate">🥇 1st</span>
                      <span className="text-xs font-black text-amber-950 dark:text-amber-100 truncate block">
                        {topThree[0].name || topThree[0].username}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block">{topThree[0].xp} XP</span>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-800/80 border-4 border-amber-700 flex items-center justify-center text-2xl font-black text-amber-100 shadow-md">
                      {(topThree[2].username || '3')[0].toUpperCase()}
                    </div>
                    <div className="bg-amber-900/10 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-800/40 w-full text-center">
                      <span className="text-[10px] font-black uppercase text-amber-600 block truncate">🥉 3rd</span>
                      <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate block">
                        {topThree[2].name || topThree[2].username}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-500 block">{topThree[2].xp} XP</span>
                    </div>
                  </motion.div>
                ) : <div />}
              </div>
            )}

            {/* Complete Leaderboard List with Framer Motion Animation */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              <AnimatePresence>
                {leaderboard.map((entry) => {
                  const isCurrent = currentUser && entry.username === currentUser.username;
                  const badge = getRankBadge(entry.rank);

                  return (
                    <motion.div
                      key={entry.username}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 flex items-center justify-between gap-4 transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-l-emerald-500'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-850'
                      }`}
                    >
                      {/* Left: Rank & User */}
                      <div className="flex items-center gap-4 min-w-0">
                        <span className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-extrabold text-xs shrink-0 ${badge.color}`}>
                          {badge.label}
                        </span>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">
                              {entry.name || entry.username}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-zinc-400 font-semibold block truncate">
                            @{entry.username}
                          </span>
                        </div>
                      </div>

                      {/* Right: XP & Streak */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-1 font-bold text-xs text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-xl border border-orange-200 dark:border-orange-900/50">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" />
                          <span>{entry.streak}d</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-900/50">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{entry.xp} XP</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
