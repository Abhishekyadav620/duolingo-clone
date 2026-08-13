'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mascot } from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { LogIn, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await login(username.trim(), password.trim());
      router.push('/');
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login('learner', 'password123');
      router.push('/');
    } catch {
      // Fallback: if password differs, try logging in or redirecting
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header Card */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Mascot mood="happy" size="lg" />
          </div>
          <h1 className="text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight">
            Log in to Learnly
          </h1>
          <p className="text-sm font-bold text-zinc-400">
            Welcome back! Pick up right where you left off.
          </p>
        </div>

        {/* 3D Form Card */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-b-4 border-[#E5E5E5] dark:border-zinc-800 border-b-[#CECECE] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#1CB0F6] rounded-2xl px-4 py-3 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#1CB0F6] rounded-2xl px-4 py-3 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Log In
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-xs font-black text-zinc-400 uppercase tracking-wider">
              Or
            </span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          {/* Shortcut Quick Demo Login */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles className="w-5 h-5 mr-2 text-[#1CB0F6]" />
            One-Click Demo Learner Login
          </Button>
        </div>

        {/* Link to Signup */}
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-[#1CB0F6] font-black hover:underline inline-flex items-center"
            >
              Sign up <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
