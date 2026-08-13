'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { getAIExplanation } from '@/lib/api';

export interface FeedbackBarProps {
  exerciseId?: number;
  userAnswer?: string;
  submitted: boolean;
  isCorrect: boolean | null;
  correctAnswer?: string;
  canSubmit: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  exerciseId,
  userAnswer,
  submitted,
  isCorrect,
  correctAnswer,
  canSubmit,
  onCheck,
  onContinue,
}) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);
  const [prevExerciseId, setPrevExerciseId] = useState<number | undefined>(exerciseId);

  // Adjust state during render when exerciseId changes
  if (exerciseId !== prevExerciseId) {
    setPrevExerciseId(exerciseId);
    setExplanation(null);
    setLoadingExplanation(false);
  }

  const handleGetExplanation = async () => {
    if (!exerciseId || !userAnswer || loadingExplanation || explanation) return;
    setLoadingExplanation(true);
    try {
      const res = await getAIExplanation(exerciseId, userAnswer);
      setExplanation(res.explanation);
    } catch {
      setExplanation(`The correct answer is "${correctAnswer}".`);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <footer className={`sticky bottom-0 left-0 right-0 z-30 border-t-2 transition-all duration-300 py-5 px-6 md:px-12 ${
      !submitted
        ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
        : isCorrect
        ? 'bg-[#D7FFB8] dark:bg-emerald-950/90 border-[#58CC02] text-[#3C3C3C] dark:text-emerald-100'
        : 'bg-[#FFDCDC] dark:bg-rose-950/90 border-[#FF4B4B] text-[#3C3C3C] dark:text-rose-100'
    }`}>
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          {/* Feedback Message Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <div key="unsubmitted" className="hidden sm:block text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  Select your answer to proceed
                </div>
              ) : isCorrect ? (
                <motion.div
                  key="correct"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#58CC02] flex items-center justify-center shadow-md shrink-0">
                    <CheckCircle2 className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#58CC02] dark:text-emerald-300 tracking-tight">
                      Great job!
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-emerald-200 font-bold">
                      Your answer is correct
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="incorrect"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#FF4B4B] flex items-center justify-center shadow-md shrink-0 mt-0.5">
                    <XCircle className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xl font-black text-[#FF4B4B] dark:text-rose-300 tracking-tight">
                        Incorrect Answer
                      </h4>
                      {/* AI Explain Button */}
                      {!explanation && (
                        <button
                          onClick={handleGetExplanation}
                          disabled={loadingExplanation}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-[#FF4B4B] font-extrabold text-[11px] uppercase tracking-wider shadow-xs hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                        >
                          {loadingExplanation ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <HelpCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Why was I wrong?</span>
                        </button>
                      )}
                    </div>

                    {correctAnswer ? (
                      <div className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-rose-100 bg-white/80 dark:bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 inline-block">
                        The correct option is: <span className="font-black text-[#FF4B4B] underline">{correctAnswer}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600 dark:text-rose-200 font-bold">
                        That is not the correct option.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            {!submitted ? (
              <Button
                variant="primary"
                size="lg"
                onClick={onCheck}
                disabled={!canSubmit}
                className="min-w-[140px]"
              >
                Check
              </Button>
            ) : (
              <Button
                variant={isCorrect ? 'primary' : 'danger'}
                size="lg"
                onClick={onContinue}
                className="min-w-[140px]"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* AI Mistake Explanation Card */}
        {submitted && !isCorrect && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white dark:bg-zinc-900 border-2 border-rose-300 dark:border-rose-800 rounded-2xl p-3.5 shadow-sm text-left space-y-1 mt-1"
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-rose-500 fill-rose-400" />
              <span>AI Explanation</span>
            </div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed">
              {explanation}
            </p>
          </motion.div>
        )}
      </div>
    </footer>
  );
};
