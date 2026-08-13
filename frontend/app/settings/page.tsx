'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useTheme, Theme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { LanguageSelectorModal } from '@/components/ui/LanguageSelectorModal';
import { SuperSubscriptionModal } from '@/components/ui/SuperSubscriptionModal';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Globe,
  Bell,
  Volume2,
  Mic,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    activeLanguage,
    notificationsEnabled,
    setNotificationsEnabled,
    soundEnabled,
    setSoundEnabled,
    speechEnabled,
    setSpeechEnabled,
  } = useSettings();

  const [langModalOpen, setLangModalOpen] = useState(false);
  const [superModalOpen, setSuperModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <LanguageSelectorModal isOpen={langModalOpen} onClose={() => setLangModalOpen(false)} />
      <SuperSubscriptionModal isOpen={superModalOpen} onClose={() => setSuperModalOpen(false)} />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2 font-bold text-xs text-[#58CC02] uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Settings & Preferences
          </h1>
        </div>

        <div className="space-y-6">
          {/* 1. Appearance / Dark Mode */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Appearance Mode</h3>
                <p className="text-xs text-zinc-400">Choose your preferred light or dark theme.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Laptop },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as Theme)}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#58CC02] text-[#58CC02]'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Active Learning Language */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#58CC02] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Active Course Language</h3>
                  <p className="text-xs text-zinc-400">Currently practicing {activeLanguage}.</p>
                </div>
              </div>
              <button
                onClick={() => setLangModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-[#58CC02] text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-600 transition cursor-pointer"
              >
                Change ({activeLanguage})
              </button>
            </div>
          </div>

          {/* 3. Toggles: Notifications, Sound, Speech */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-black text-base text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Sound & Notification Toggles
            </h3>

            {/* Daily Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Daily Practice Reminders</h4>
                  <p className="text-xs text-zinc-400">Receive notifications to maintain your daily streak.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#58CC02] cursor-pointer"
              />
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-[#1CB0F6] flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Sound Effects</h4>
                  <p className="text-xs text-zinc-400">Play audio chimes on correct or incorrect answers.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#58CC02] cursor-pointer"
              />
            </div>

            {/* Speech / Text to Speech */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Text-to-Speech Audio</h4>
                  <p className="text-xs text-zinc-400">Synthesize audio voice playback during exercises.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={speechEnabled}
                onChange={(e) => setSpeechEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#58CC02] cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Super Subscription Section */}
          <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10 border-2 border-amber-500/50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Learnly Super Subscription</h3>
                  <p className="text-xs text-amber-200/80">Unlimited hearts & ad-free practice.</p>
                </div>
              </div>
              <button
                onClick={() => setSuperModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

