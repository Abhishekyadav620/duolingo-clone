'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Mascot } from '../ui/Mascot';
import { useAuth } from '@/context/AuthContext';
import {
  Home as HomeIcon,
  Bot,
  Dumbbell,
  Trophy,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'AI Tutor', href: '/tutor', icon: Bot },
    { name: 'Practice', href: '/practice', icon: Dumbbell },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <>
      {/* Top Desktop & Mobile Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
            <Mascot mood="happy" size="sm" />
            <span className="font-black text-2xl tracking-tight text-[#58CC02]">
              Learnly
            </span>
          </Link>

          {/* Desktop Navigation Links & Logout */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#58CC02]/15 text-[#58CC02] border-2 border-[#58CC02]/30 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#58CC02]' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                title="Log Out"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider whitespace-nowrap text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition ml-2 cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* Medium Screen (Tablet) Navigation Layout */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#58CC02]/15 text-[#58CC02] border border-[#58CC02]/30'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#58CC02]' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {user && (
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-xl font-black text-[11px] uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </nav>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Header Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#58CC02]/15 text-[#58CC02] border-2 border-[#58CC02]/30'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Logout ({user.username})</span>
              </button>
            )}
          </nav>
        )}
      </header>

      {/* Bottom Mobile Sticky Bar for 390px Viewports */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t-2 border-zinc-200 dark:border-zinc-800 px-1 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-2xl transition-all ${
                isActive ? 'text-[#58CC02] scale-105 font-black' : 'text-zinc-400 font-bold'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[9px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
