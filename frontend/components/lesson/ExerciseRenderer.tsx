'use client';

import React, { useState } from 'react';
import { PublicExercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIHint } from '@/lib/api';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';

import { MultipleChoiceExercise } from './exercises/MultipleChoiceExercise';
import { TranslateExercise } from './exercises/TranslateExercise';
import { MatchPairsExercise } from './exercises/MatchPairsExercise';
import { FillBlankExercise } from './exercises/FillBlankExercise';
import { TypeAnswerExercise } from './exercises/TypeAnswerExercise';
import { ListeningExercise } from './exercises/ListeningExercise';
import { SpeakingExercise } from './exercises/SpeakingExercise';

export interface ExerciseRendererProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  onCheck: () => void;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  submitted,
  isCorrect,
  onCheck,
}) => {
  const normalizedType = (exercise.type || '').toLowerCase();
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);
  const [prevExerciseId, setPrevExerciseId] = useState<number>(exercise.id);

  // Adjust state during render when exercise.id changes
  if (exercise.id !== prevExerciseId) {
    setPrevExerciseId(exercise.id);
    setHint(null);
    setLoadingHint(false);
  }

  const handleGetHint = async () => {
    if (loadingHint || hint || submitted) return;
    setLoadingHint(true);
    try {
      const res = await getAIHint(exercise.id, selectedAnswer);
      setHint(res.hint);
    } catch {
      setHint("Think carefully about the Spanish vocabulary for this lesson!");
    } finally {
      setLoadingHint(false);
    }
  };

  const renderExerciseContent = () => {
    switch (normalizedType) {
      case 'multiple_choice':
      case 'select_option':
        return (
          <MultipleChoiceExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
          />
        );

      case 'translate':
        return (
          <TranslateExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
          />
        );

      case 'match_pairs':
      case 'matching':
        return (
          <MatchPairsExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
          />
        );

      case 'fill_blank':
        return (
          <FillBlankExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
          />
        );

      case 'type_answer':
        return (
          <TypeAnswerExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
            onCheck={onCheck}
          />
        );

      case 'listening':
        return (
          <ListeningExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
            onCheck={onCheck}
          />
        );

      case 'speaking':
        return (
          <SpeakingExercise
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
            onCheck={onCheck}
          />
        );

      default:
        return (
          <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-center">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Unknown exercise type: <code className="font-mono">{exercise.type}</code>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top AI Hint Trigger & Display Card */}
      {!submitted && (
        <div className="flex flex-col items-center sm:items-end">
          {!hint ? (
            <button
              onClick={handleGetHint}
              disabled={loadingHint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-100 transition cursor-pointer disabled:opacity-60"
            >
              {loadingHint ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Get Hint</span>
                </>
              )}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-4 shadow-sm w-full text-left space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>AI Tutor Hint</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100 leading-relaxed">
                {hint}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Main Exercise Renderer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full"
        >
          {renderExerciseContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
