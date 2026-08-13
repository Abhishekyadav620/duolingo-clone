'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Settings, User, Bell, Globe, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2 font-bold text-xs text-zinc-400 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Profile</h3>
                <p className="text-xs text-zinc-400">Account details and avatar customization coming soon.</p>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Notifications</h3>
                <p className="text-xs text-zinc-400">Daily practice reminders coming soon.</p>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Active Language</h3>
                  <p className="text-xs text-zinc-400">Currently learning Spanish course.</p>
                </div>
              </div>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                Spanish
              </span>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Subscription</h3>
                <p className="text-xs text-zinc-400">Super Duolingo features coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
