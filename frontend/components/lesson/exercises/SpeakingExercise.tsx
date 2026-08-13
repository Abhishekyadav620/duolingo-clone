'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PublicExercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, RefreshCw, Volume2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { getAISpeakingFeedback } from '@/lib/api';

export interface SpeakingExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  onCheck?: () => void;
}

type SpeakingState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'recognized'
  | 'unsupported'
  | 'permission_denied';

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

export const SpeakingExercise: React.FC<SpeakingExerciseProps> = ({
  exercise,
  onSelectAnswer,
  submitted,
  isCorrect,
}) => {
  const targetText =
    (exercise.data?.audio_text as string) ||
    exercise.question;

  const [state, setState] = useState<SpeakingState>(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as Record<string, unknown>;
      const SpeechAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechAPI) return 'unsupported';
    }
    return 'idle';
  });

  const [transcript, setTranscript] = useState<string>('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingAiFeedback, setLoadingAiFeedback] = useState<boolean>(false);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognitionConstructor = (win.SpeechRecognition || win.webkitSpeechRecognition) as {
      new (): ISpeechRecognitionInstance;
    } | undefined;

    if (!SpeechRecognitionConstructor) return;

    try {
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setState('recording');
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        onSelectAnswer(currentTranscript);
      };

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setState('permission_denied');
        } else {
          setState('idle');
        }
      };

      recognition.onend = () => {
        setState((prevState) => {
          if (prevState === 'recording' || prevState === 'processing') {
            return 'recognized';
          }
          return prevState;
        });
      };

      recognitionRef.current = recognition;
    } catch {
      // Ignore construction errors
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [exercise.id, onSelectAnswer]);

  // Request audio playback of prompt using SpeechSynthesis
  const playPromptAudio = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  }, [targetText]);

  const startListening = () => {
    if (submitted) return;
    if (state === 'unsupported' || state === 'permission_denied') return;

    setTranscript('');
    onSelectAnswer('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setState('recording');
      } catch (err: unknown) {
        const errorObj = err as { name?: string };
        if (errorObj?.name === 'InvalidStateError') {
          try {
            recognitionRef.current.stop();
            setTimeout(() => recognitionRef.current?.start(), 200);
          } catch {
            setState('idle');
          }
        } else {
          setState('permission_denied');
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && state === 'recording') {
      try {
        setState('processing');
        recognitionRef.current.stop();
      } catch {
        setState('recognized');
      }
    }
  };

  const handleGetAiFeedback = async () => {
    if (loadingAiFeedback || aiFeedback || !transcript) return;
    setLoadingAiFeedback(true);
    try {
      const res = await getAISpeakingFeedback(targetText, transcript);
      setAiFeedback(res.feedback);
    } catch {
      setAiFeedback(`Try practicing the phrase "${targetText}" carefully.`);
    } finally {
      setLoadingAiFeedback(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Exercise Subtitle Header */}
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-[#FF4B4B] dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider">
          <Mic className="w-4 h-4" />
          <span>Speaking Practice</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight pt-1">
          {exercise.question || 'Say this sentence'}
        </h2>
      </div>

      {/* Target Phrase Box with Listen Button */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-xs">
        <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          &ldquo;{targetText}&rdquo;
        </p>
        <button
          onClick={playPromptAudio}
          type="button"
          aria-label="Listen to phrase audio"
          className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-[#1CB0F6] dark:text-sky-300 hover:bg-sky-200 transition cursor-pointer shrink-0"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Main Microphone Interaction Stage */}
      <div className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-6 min-h-[220px]">
        {state === 'unsupported' ? (
          <div className="text-center space-y-3 p-4">
            <MicOff className="w-12 h-12 text-zinc-400 mx-auto" />
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 max-w-md">
              Speaking practice is not supported in this browser. Please try a browser with speech recognition support (such as Chrome or Edge).
            </p>
          </div>
        ) : state === 'permission_denied' ? (
          <div className="text-center space-y-3 p-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300 max-w-md">
              Microphone access is required for speaking practice. Please allow microphone access in your browser settings.
            </p>
            <button
              onClick={() => setState('idle')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-rose-600 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        ) : (
          <>
            {/* Interactive Mic Button */}
            <div className="relative">
              {state === 'recording' && (
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-[#FF4B4B]/30 dark:bg-rose-500/30"
                />
              )}

              <motion.button
                whileHover={submitted ? {} : { scale: 1.05 }}
                whileTap={submitted ? {} : { scale: 0.95 }}
                disabled={submitted}
                onClick={state === 'recording' ? stopListening : startListening}
                aria-label="Start speaking practice"
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer select-none ${
                  state === 'recording'
                    ? 'bg-[#FF4B4B] text-white shadow-rose-500/50 animate-pulse'
                    : transcript
                    ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                    : 'bg-[#1CB0F6] text-white hover:bg-sky-400 shadow-sky-500/40'
                } ${submitted ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
              </motion.button>
            </div>

            {/* Mic Status Text */}
            <div className="text-center space-y-1">
              {state === 'recording' ? (
                <div className="flex items-center justify-center gap-2 text-[#FF4B4B] font-black text-sm uppercase tracking-wider">
                  <span className="w-3 h-3 rounded-full bg-[#FF4B4B] animate-ping" />
                  <span>Listening... Tap when done</span>
                </div>
              ) : state === 'processing' ? (
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 animate-pulse">
                  Processing your speech...
                </p>
              ) : transcript ? (
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider block">
                    You said:
                  </span>
                  <p className="text-lg font-black text-zinc-900 dark:text-white">
                    &ldquo;{transcript}&rdquo;
                  </p>
                </div>
              ) : (
                <p className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400">
                  Tap microphone to start speaking
                </p>
              )}
            </div>

            {/* Retry Button if already spoke */}
            {!submitted && transcript && state !== 'recording' && (
              <button
                onClick={startListening}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-300 dark:hover:bg-zinc-700 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* AI Speaking Feedback Card (shown on incorrect submission) */}
      <AnimatePresence>
        {submitted && isCorrect === false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-200 dark:border-rose-900/60 rounded-3xl p-4 sm:p-5 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-500 fill-rose-400" />
                <span>AI Speaking Feedback</span>
              </div>
              {!aiFeedback && (
                <button
                  onClick={handleGetAiFeedback}
                  disabled={loadingAiFeedback}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-zinc-900 text-rose-600 font-extrabold text-xs uppercase tracking-wider shadow-xs hover:bg-rose-100 transition cursor-pointer disabled:opacity-50"
                >
                  {loadingAiFeedback ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Explain mistake</span>
                  )}
                </button>
              )}
            </div>

            {aiFeedback && (
              <p className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-100 leading-relaxed pt-1">
                {aiFeedback}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
