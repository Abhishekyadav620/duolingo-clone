'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { getLesson, getCurrentUser, submitAnswer, completeLesson } from '@/lib/api';
import { PublicLessonResponse, LessonCompletionResponse } from '@/types';
import { useToast } from '@/components/ui/ToastContext';

import { LessonHeader } from '@/components/lesson/LessonHeader';
import { ExerciseRenderer } from '@/components/lesson/ExerciseRenderer';
import { FeedbackBar } from '@/components/lesson/FeedbackBar';
import { LessonComplete } from '@/components/lesson/LessonComplete';
import { ExitLessonModal } from '@/components/lesson/ExitLessonModal';
import { OutOfHeartsModal } from '@/components/lesson/OutOfHeartsModal';
import { SkillUnlockModal } from '@/components/lesson/SkillUnlockModal';
import { Button } from '@/components/ui/Button';

import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.lessonId;
  const router = useRouter();
  const { showToast } = useToast();

  const [lesson, setLesson] = useState<PublicLessonResponse | null>(null);
  const [hearts, setHearts] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lesson state loop
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  const [completed, setCompleted] = useState<boolean>(false);
  const [completionData, setCompletionData] = useState<LessonCompletionResponse | null>(null);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState<boolean>(false);
  const [showSkillUnlockModal, setShowSkillUnlockModal] = useState<boolean>(false);

  const loadLessonData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [lessonData, userData] = await Promise.all([
        getLesson(Number(lessonId)),
        getCurrentUser()
      ]);
      setLesson(lessonData);
      setHearts(userData.hearts);
      setCurrentExerciseIndex(0);
      setSelectedAnswer('');
      setSubmitted(false);
      setIsCorrect(null);
      setCompleted(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || `Unable to load lesson #${lessonId}.`);
      } else {
        setError(`Unable to load lesson #${lessonId}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    let ignore = false;

    async function fetchLesson() {
      try {
        const [lessonData, userData] = await Promise.all([
          getLesson(Number(lessonId)),
          getCurrentUser()
        ]);
        if (!ignore) {
          setLesson(lessonData);
          setHearts(userData.hearts);
          setCurrentExerciseIndex(0);
          setSelectedAnswer('');
          setSubmitted(false);
          setIsCorrect(null);
          setCompleted(false);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof Error) {
            setError(err.message || `Unable to load lesson #${lessonId}.`);
          } else {
            setError(`Unable to load lesson #${lessonId}.`);
          }
          setLoading(false);
        }
      }
    }

    fetchLesson();

    return () => {
      ignore = true;
    };
  }, [lessonId]);

  // Check answer handler calling backend POST /api/lessons/<id>/answer/
  const handleCheck = async () => {
    if (!lesson || !lesson.exercises[currentExerciseIndex] || submitted || submitting) return;
    const currentEx = lesson.exercises[currentExerciseIndex];

    setSubmitting(true);
    try {
      const res = await submitAnswer(Number(lessonId), currentEx.id, selectedAnswer);
      setIsCorrect(res.correct);
      setHearts(res.hearts_remaining);

      if (res.correct_answer) {
        setCorrectAnswer(res.correct_answer);
      } else {
        setCorrectAnswer('');
      }

      setSubmitted(true);

      if (res.lesson_failed || res.hearts_remaining <= 0) {
        setShowOutOfHeartsModal(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('out of hearts')) {
        setShowOutOfHeartsModal(true);
      } else {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Continue to next exercise or call backend completion API
  const handleContinue = async () => {
    if (!lesson) return;

    if (currentExerciseIndex + 1 < lesson.exercises.length) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setSubmitted(false);
      setIsCorrect(null);
      setCorrectAnswer('');
    } else {
      setSubmitting(true);
      try {
        const compRes = await completeLesson(Number(lessonId));
        setCompletionData(compRes);
        setCompleted(true);

        showToast(`+${compRes.xp_earned} XP earned!`, 'success');

        if (compRes.next_skill_unlocked) {
          setShowSkillUnlockModal(true);
        }
      } catch {
        setCompleted(true);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleFinishLesson = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 font-sans">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-zinc-500">Loading lesson...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Lesson Not Found</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{error || 'Lesson data could not be retrieved.'}</p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Path
            </Button>
            <Button variant="primary" fullWidth onClick={loadLessonData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <>
        <LessonComplete
          title={lesson.title}
          totalExercises={lesson.exercises.length}
          completionData={completionData}
          defaultXpReward={lesson.xp_reward}
          onFinish={handleFinishLesson}
        />

        <SkillUnlockModal
          isOpen={showSkillUnlockModal}
          onClose={() => setShowSkillUnlockModal(false)}
          unlockedSkillTitle="Next Spanish Skill"
        />
      </>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const canSubmit = selectedAnswer.trim().length > 0 && !submitting;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col justify-between">
      {/* Top Lesson Header */}
      <LessonHeader
        onExit={() => setShowExitModal(true)}
        title={lesson.title}
        currentExerciseIndex={currentExerciseIndex + 1}
        totalExercises={lesson.exercises.length}
        hearts={hearts}
      />

      {/* Main Focused Exercise Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
        {currentExercise ? (
          <ExerciseRenderer
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswer}
            submitted={submitted}
            isCorrect={isCorrect}
            onCheck={handleCheck}
          />
        ) : (
          <div className="text-center text-zinc-400">No exercise content found.</div>
        )}
      </main>

      {/* Bottom Sticky Feedback Bar */}
      <FeedbackBar
        exerciseId={currentExercise?.id}
        userAnswer={selectedAnswer}
        submitted={submitted}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer}
        canSubmit={canSubmit}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />

      {/* Exit Modal Confirmation */}
      <ExitLessonModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={() => {
          setShowExitModal(false);
          router.push('/');
        }}
      />

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal
        isOpen={showOutOfHeartsModal}
        onRefillSuccess={(newHearts) => {
          setHearts(newHearts);
          setShowOutOfHeartsModal(false);
          showToast('❤️ Hearts Refilled!', 'success');
        }}
        onExit={() => {
          setShowOutOfHeartsModal(false);
          router.push('/');
        }}
      />
    </div>
  );
}
