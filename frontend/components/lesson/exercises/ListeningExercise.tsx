'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PublicExercise } from '@/types';
import { motion } from 'framer-motion';
import { Volume2, Turtle } from 'lucide-react';

export interface ListeningExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  onCheck?: () => void;
}

export const ListeningExercise: React.FC<ListeningExerciseProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  submitted,
  onCheck,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioText = (exercise.data?.audio_text as string) || '';
  const options = Array.isArray(exercise.options) ? (exercise.options as string[]) : [];

  const playAudio = useCallback((rate: number = 1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    if (!audioText) return;

    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = 'es-ES';
    utterance.rate = rate;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [audioText]);

  // Auto-play audio once on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio(1);
    }, 300);
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [exercise.id, playAudio]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !submitted && selectedAnswer.trim().length > 0 && onCheck) {
      e.preventDefault();
      onCheck();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Question Header */}
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#1CB0F6] dark:text-sky-300 font-extrabold text-xs uppercase tracking-wider">
          <Volume2 className="w-4 h-4" />
          <span>Listening Practice</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight pt-1">
          {exercise.question || 'Listen carefully'}
        </h2>
      </div>

      {/* Audio Playback Hero Box */}
      <div className="bg-gradient-to-b from-sky-50 to-sky-100/50 dark:from-sky-950/40 dark:to-zinc-900 border-2 border-sky-200 dark:border-sky-900/60 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-5 shadow-sm">
        {/* Animated Waveform Graphic */}
        <div className="flex items-center gap-1.5 h-10 px-4">
          {[0.6, 1, 0.4, 0.8, 1.2, 0.5, 0.9, 0.7, 1.1, 0.5].map((scale, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? {
                      scaleY: [0.3, scale, 0.2, scale * 1.2, 0.3],
                      backgroundColor: ['#1CB0F6', '#58CC02', '#1CB0F6'],
                    }
                  : { scaleY: 0.3, backgroundColor: '#CBD5E1' }
              }
              transition={
                isPlaying
                  ? {
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: i * 0.08,
                    }
                  : { duration: 0.3 }
              }
              className="w-1.5 h-8 bg-sky-300 dark:bg-sky-700 rounded-full origin-center"
            />
          ))}
        </div>

        {/* Audio Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Main Play Audio Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playAudio(1)}
            aria-label="Play Spanish audio"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#1CB0F6] hover:bg-sky-400 border-b-4 border-[#0092DF] text-white font-black text-lg shadow-md transition-all cursor-pointer active:border-b-0 active:mt-1"
          >
            <Volume2 className="w-7 h-7" />
            <span>PLAY AUDIO</span>
          </motion.button>

          {/* Slow Audio Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playAudio(0.7)}
            aria-label="Play Spanish audio slowly"
            className="flex items-center gap-2.5 px-4 py-4 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 border-b-4 text-amber-600 dark:text-amber-400 font-extrabold text-sm shadow-xs transition-all cursor-pointer active:border-b-0 active:mt-1"
          >
            <Turtle className="w-5 h-5 text-amber-500" />
            <span>SLOW (0.7x)</span>
          </motion.button>
        </div>
      </div>

      {/* Answer Options or Input */}
      {options.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5 pt-2">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            return (
              <motion.button
                key={option}
                whileHover={submitted ? {} : { scale: 1.01, y: -2 }}
                whileTap={submitted ? {} : { scale: 0.98, y: 2 }}
                disabled={submitted}
                onClick={() => onSelectAnswer(option)}
                className={`flex items-center gap-4 p-4 sm:p-5 rounded-3xl border-2 border-b-4 font-black text-base sm:text-lg transition-all select-none cursor-pointer text-left w-full ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-[#1CB0F6] border-b-[#0092DF] text-[#1CB0F6] dark:text-sky-300 shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-[#E5E5E5] dark:border-zinc-800 border-b-[#CECECE] text-[#3C3C3C] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                } ${submitted ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <span
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono text-sm font-black border-2 ${
                    isSelected
                      ? 'bg-[#1CB0F6] text-white border-[#0092DF]'
                      : 'bg-[#F7F7F7] dark:bg-zinc-800 text-zinc-500 border-[#E5E5E5] dark:border-zinc-700'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex-1">{option}</span>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2 pt-2">
          <label htmlFor="listening-answer-input" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            What did you hear? (Type in Spanish)
          </label>
          <input
            id="listening-answer-input"
            type="text"
            disabled={submitted}
            value={selectedAnswer}
            onChange={(e) => onSelectAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type what you heard..."
            autoFocus
            className="w-full p-4 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-lg focus:outline-none focus:border-[#1CB0F6] shadow-sm transition disabled:opacity-80"
          />
        </div>
      )}
    </div>
  );
};
