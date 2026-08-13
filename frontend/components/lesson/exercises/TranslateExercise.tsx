'use client';

import React, { useState, useEffect } from 'react';
import { PublicExercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export interface TranslateExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
}

export const TranslateExercise: React.FC<TranslateExerciseProps> = ({
  exercise,
  onSelectAnswer,
  submitted,
}) => {
  const options = Array.isArray(exercise.options) ? exercise.options as string[] : [];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    onSelectAnswer(selectedWords.join(' '));
  }, [selectedWords, onSelectAnswer]);

  const handleSelectWord = (word: string) => {
    if (submitted) return;
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleRemoveWord = (wordIndex: number) => {
    if (submitted) return;
    setSelectedWords((prev) => prev.filter((_, idx) => idx !== wordIndex));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Question Header */}
      <h2 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight text-center sm:text-left">
        {exercise.question}
      </h2>

      {/* Selected Sentence Builder Area */}
      <div className="min-h-[80px] bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-3.5 flex flex-wrap items-center gap-2 transition-all shadow-inner">
        {selectedWords.length === 0 ? (
          <span className="text-xs text-zinc-400 font-extrabold px-3 select-none uppercase tracking-wider">
            Tap the word chips below to construct your answer...
          </span>
        ) : (
          <AnimatePresence>
            {selectedWords.map((word, idx) => (
              <motion.button
                key={`${word}-${idx}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                disabled={submitted}
                onClick={() => handleRemoveWord(idx)}
                className="px-4 py-2 bg-[#1CB0F6] hover:bg-[#24B9FF] text-white font-black text-sm sm:text-base rounded-2xl border-b-4 border-[#0092DF] shadow-md transition-all active:translate-y-0.5 active:border-b-2"
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Word Bank Area */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
          Word Bank
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          {options.map((word, idx) => {
            const countInSelected = selectedWords.filter((w) => w === word).length;
            const countInOptions = options.filter((w) => w === word).length;
            const isUsed = countInSelected >= countInOptions;

            return (
              <motion.button
                key={`${word}-option-${idx}`}
                whileHover={isUsed || submitted ? {} : { scale: 1.05, y: -2 }}
                whileTap={isUsed || submitted ? {} : { scale: 0.95, y: 2 }}
                disabled={isUsed || submitted}
                onClick={() => handleSelectWord(word)}
                className={`px-4 py-2.5 rounded-2xl font-black text-sm sm:text-base border-2 border-b-4 transition-all select-none ${
                  isUsed
                    ? 'bg-[#E5E5E5] dark:bg-zinc-800 text-transparent border-[#CECECE] dark:border-zinc-700 cursor-not-allowed opacity-40 shadow-none'
                    : 'bg-white dark:bg-zinc-900 text-[#3C3C3C] dark:text-zinc-100 border-[#E5E5E5] dark:border-zinc-700 border-b-[#CECECE] hover:bg-zinc-50 shadow-sm cursor-pointer'
                }`}
              >
                {word}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
