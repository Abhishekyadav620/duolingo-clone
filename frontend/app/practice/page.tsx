'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Dumbbell, ArrowRight } from 'lucide-react';

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col items-center justify-center text-center space-y-6 my-12">
        <div className="w-20 h-20 rounded-3xl bg-sky-100 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center border border-sky-200 dark:border-sky-800 shadow-md animate-bounce-short">
          <Dumbbell className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Practice Mode
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Dedicated practice hub is coming soon! Use the Learning Path to continue practicing your Spanish skills.
          </p>
        </div>

        <div className="w-full pt-2">
          <Link href="/">
            <Button variant="primary" fullWidth size="lg">
              Go to Learning Path
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
