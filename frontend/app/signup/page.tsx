'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mascot } from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await signup(
        username.trim(),
        email.trim(),
        password.trim(),
        firstName.trim(),
        lastName.trim()
      );
      router.push('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseData = (err as { response?: { data?: { detail?: string } } }).response?.data;
        if (responseData?.detail) {
          setError(responseData.detail);
          setLoading(false);
          return;
        }
      }
      setError('Registration failed. Please try a different username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Mascot mood="celebrate" size="lg" />
          </div>
          <h1 className="text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight">
            Create your profile
          </h1>
          <p className="text-sm font-bold text-zinc-400">
            Join Learnly to start your Spanish learning journey today!
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#58CC02] rounded-2xl px-3.5 py-2.5 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#58CC02] rounded-2xl px-3.5 py-2.5 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                Username *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#58CC02] rounded-2xl px-4 py-2.5 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#58CC02] rounded-2xl px-4 py-2.5 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 focus:border-[#58CC02] rounded-2xl px-4 py-2.5 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-3"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </form>
        </div>

        {/* Link to Login */}
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#58CC02] font-black hover:underline inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
