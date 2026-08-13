'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AITutor } from '@/components/ai/AITutor';

export default function TutorPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-zinc-950 text-[#3C3C3C] dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AITutor />
      </main>
    </div>
  );
}
