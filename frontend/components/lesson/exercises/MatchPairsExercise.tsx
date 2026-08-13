'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PublicExercise } from '@/types';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface MatchPairsExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
}

export const MatchPairsExercise: React.FC<MatchPairsExerciseProps> = ({
  exercise,
  onSelectAnswer,
  submitted,
}) => {
  const rawPairs = useMemo(() => {
    return (exercise.options || []) as Array<{ pair: [string, string] }>;
  }, [exercise.options]);

  const leftItems = useMemo(() => {
    if (exercise.data && exercise.data.left_items) {
      return exercise.data.left_items as string[];
    }
    return Array.isArray(rawPairs) ? rawPairs.map((p) => p.pair[0]) : [];
  }, [exercise.data, rawPairs]);

  const rightItems = useMemo(() => {
    let rights: string[] = [];
    if (exercise.data && exercise.data.right_items) {
      rights = exercise.data.right_items as string[];
    } else if (Array.isArray(rawPairs)) {
      rights = rawPairs.map((p) => p.pair[1]);
    }
    return [...rights].sort();
  }, [exercise.data, rawPairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ [left: string]: string }>({});
  const [mismatchError, setMismatchError] = useState<{ left: string; right: string } | null>(null);

  useEffect(() => {
    const formatted = Object.entries(matchedPairs)
      .map(([l, r]) => `${l}:${r}`)
      .join(', ');
    onSelectAnswer(formatted);
  }, [matchedPairs, onSelectAnswer]);

  const handleSelectLeft = (item: string) => {
    if (submitted || matchedPairs[item]) return;
    setMismatchError(null);
    setSelectedLeft(item);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleSelectRight = (item: string) => {
    if (submitted || Object.values(matchedPairs).includes(item)) return;
    setMismatchError(null);
    setSelectedRight(item);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left: string, right: string) => {
    let isPairValid = false;

    if (Array.isArray(rawPairs) && rawPairs.length > 0) {
      isPairValid = rawPairs.some((p) => p.pair[0] === left && p.pair[1] === right);
    } else if (exercise.data && exercise.data.pairs) {
      const pObj = exercise.data.pairs as unknown as { [l: string]: string };
      isPairValid = pObj[left] === right;
    }

    if (isPairValid) {
      setMatchedPairs((prev) => ({ ...prev, [left]: right }));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setMismatchError({ left, right });
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMismatchError(null);
      }, 700);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      <h2 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight text-center sm:text-left">
        {exercise.question || 'Match the pairs'}
      </h2>

      <div className="grid grid-cols-2 gap-3.5 pt-2">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map((item) => {
            const isMatched = !!matchedPairs[item];
            const isSelected = selectedLeft === item;
            const isError = mismatchError?.left === item;

            return (
              <motion.button
                key={item}
                whileHover={isMatched || submitted ? {} : { scale: 1.02, y: -2 }}
                whileTap={isMatched || submitted ? {} : { scale: 0.97, y: 2 }}
                disabled={isMatched || submitted}
                onClick={() => handleSelectLeft(item)}
                className={`w-full p-4 rounded-3xl border-2 border-b-4 font-black text-sm sm:text-base transition select-none flex items-center justify-between ${
                  isMatched
                    ? 'bg-[#D7FFB8] dark:bg-emerald-950/40 border-[#58CC02] border-b-[#46A302] text-[#58CC02] opacity-80 cursor-default shadow-none'
                    : isError
                    ? 'bg-[#FFDCDC] dark:bg-rose-950/40 border-[#FF4B4B] border-b-[#EA2B2B] text-[#FF4B4B] animate-shake'
                    : isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-[#1CB0F6] border-b-[#0092DF] text-[#1CB0F6] shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-[#E5E5E5] dark:border-zinc-800 border-b-[#CECECE] text-[#3C3C3C] dark:text-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <span>{item}</span>
                {isMatched && <Check className="w-5 h-5 text-[#58CC02] stroke-[3.5]" />}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map((item) => {
            const isMatched = Object.values(matchedPairs).includes(item);
            const isSelected = selectedRight === item;
            const isError = mismatchError?.right === item;

            return (
              <motion.button
                key={item}
                whileHover={isMatched || submitted ? {} : { scale: 1.02, y: -2 }}
                whileTap={isMatched || submitted ? {} : { scale: 0.97, y: 2 }}
                disabled={isMatched || submitted}
                onClick={() => handleSelectRight(item)}
                className={`w-full p-4 rounded-3xl border-2 border-b-4 font-black text-sm sm:text-base transition select-none flex items-center justify-between ${
                  isMatched
                    ? 'bg-[#D7FFB8] dark:bg-emerald-950/40 border-[#58CC02] border-b-[#46A302] text-[#58CC02] opacity-80 cursor-default shadow-none'
                    : isError
                    ? 'bg-[#FFDCDC] dark:bg-rose-950/40 border-[#FF4B4B] border-b-[#EA2B2B] text-[#FF4B4B] animate-shake'
                    : isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-[#1CB0F6] border-b-[#0092DF] text-[#1CB0F6] shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-[#E5E5E5] dark:border-zinc-800 border-b-[#CECECE] text-[#3C3C3C] dark:text-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <span>{item}</span>
                {isMatched && <Check className="w-5 h-5 text-[#58CC02] stroke-[3.5]" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
