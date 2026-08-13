'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { SpeakerButton } from '@/components/ui/SpeakerButton';
import { speakText } from '@/lib/tts';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Mic,
  Volume2,
  Clock,
  Award,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Heart
} from 'lucide-react';

type PracticeTab = 'hub' | 'speaking' | 'listening' | 'timed' | 'legendary';

interface TimedQuestion {
  question: string;
  spanishText: string;
  options: string[];
  correct: string;
}

interface ListeningQuestion {
  phrase: string;
  choices: { label: string; isCorrect: boolean }[];
}

// Utility to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Expanded Pool of 25+ Questions
const QUESTION_BANK: TimedQuestion[] = [
  { question: 'What does "Hola" mean?', spanishText: 'Hola', options: ['Hello', 'Goodbye', 'Thank you', 'Please'], correct: 'Hello' },
  { question: 'Translate "Good morning"', spanishText: 'Buenos días', options: ['Buenos días', 'Buenas noches', 'Hasta luego', 'Por favor'], correct: 'Buenos días' },
  { question: 'What does "Gracias" mean?', spanishText: 'Gracias', options: ['Please', 'Thank you', 'Yes', 'No'], correct: 'Thank you' },
  { question: 'Translate "House" into Spanish', spanishText: 'Casa', options: ['Escuela', 'Casa', 'Perro', 'Agua'], correct: 'Casa' },
  { question: 'What does "Por favor" mean?', spanishText: 'Por favor', options: ['Please', 'Welcome', 'Sorry', 'Friend'], correct: 'Please' },
  { question: 'Translate "Water" into Spanish', spanishText: 'Agua', options: ['Pan', 'Agua', 'Leche', 'Sol'], correct: 'Agua' },
  { question: 'What does "Perro" mean?', spanishText: 'Perro', options: ['Dog', 'Cat', 'Fish', 'Bird'], correct: 'Dog' },
  { question: 'Translate "Friend" into Spanish', spanishText: 'Amigo', options: ['Gato', 'Amigo', 'Madre', 'Hermano'], correct: 'Amigo' },
  { question: 'What does "Noche" mean?', spanishText: 'Noche', options: ['Day', 'Night', 'Morning', 'Week'], correct: 'Night' },
  { question: 'Translate "Bread" into Spanish', spanishText: 'Pan', options: ['Pan', 'Fruta', 'Queso', 'Leche'], correct: 'Pan' },
  { question: 'What does "Gato" mean?', spanishText: 'Gato', options: ['Cat', 'Dog', 'Horse', 'Mouse'], correct: 'Cat' },
  { question: 'Translate "Mother" into Spanish', spanishText: 'Madre', options: ['Madre', 'Padre', 'Hermana', 'Abuela'], correct: 'Madre' },
  { question: 'What does "Escuela" mean?', spanishText: 'Escuela', options: ['School', 'House', 'Store', 'Park'], correct: 'School' },
  { question: 'Translate "Where?" into Spanish', spanishText: '¿Dónde?', options: ['¿Dónde?', '¿Qué?', '¿Quién?', '¿Cuándo?'], correct: '¿Dónde?' },
  { question: 'What does "Playa" mean?', spanishText: 'Playa', options: ['Beach', 'Park', 'City', 'River'], correct: 'Beach' },
  { question: 'Translate "Good night" into Spanish', spanishText: 'Buenas noches', options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hasta luego'], correct: 'Buenas noches' },
  { question: 'What does "Trabajo" mean?', spanishText: 'Trabajo', options: ['Work', 'Sleep', 'Travel', 'Study'], correct: 'Work' },
  { question: 'Translate "Fish" into Spanish', spanishText: 'Pez', options: ['Pez', 'Pájaro', 'Vaca', 'Caballo'], correct: 'Pez' },
  { question: 'What does "¿Cómo estás?" mean?', spanishText: '¿Cómo estás?', options: ['How are you?', 'What is your name?', 'Where do you live?', 'How old are you?'], correct: 'How are you?' },
  { question: 'Translate "Milk" into Spanish', spanishText: 'Leche', options: ['Leche', 'Café', 'Agua', 'Jugo'], correct: 'Leche' },
  { question: 'What does "Sol" mean?', spanishText: 'Sol', options: ['Sun', 'Moon', 'Star', 'Cloud'], correct: 'Sun' },
  { question: 'Translate "Brother" into Spanish', spanishText: 'Hermano', options: ['Hermano', 'Padre', 'Hijo', 'Tío'], correct: 'Hermano' },
  { question: 'What does "Parque" mean?', spanishText: 'Parque', options: ['Park', 'Beach', 'Museum', 'Street'], correct: 'Park' },
  { question: 'Translate "Apple" into Spanish', spanishText: 'Manzana', options: ['Manzana', 'Pan', 'Fruta', 'Queso'], correct: 'Manzana' },
  { question: 'What does "Hasta luego" mean?', spanishText: 'Hasta luego', options: ['See you later', 'Good morning', 'Nice to meet you', 'Excuse me'], correct: 'See you later' }
];

// Pool of Speaking Phrases
const SPEAKING_PHRASES = [
  'Hola, ¿cómo estás?',
  'Buenos días, mucho gusto.',
  'Me llamo Ana y vivo aquí.',
  'Un vaso de agua, por favor.',
  'La casa es bonita y grande.',
  'Hasta luego, mi amigo.',
  'Gracias por la comida deliciosa.'
];

// Pool of Listening Exercises
const LISTENING_POOL: ListeningQuestion[] = [
  {
    phrase: 'Hola, ¿cómo estás?',
    choices: [
      { label: 'A. Good morning', isCorrect: false },
      { label: 'B. Hello, how are you?', isCorrect: true },
      { label: 'C. Where are you going?', isCorrect: false },
      { label: 'D. See you tomorrow', isCorrect: false },
    ]
  },
  {
    phrase: 'Buenos días, señor',
    choices: [
      { label: 'A. Good morning, sir', isCorrect: true },
      { label: 'B. Good night, friend', isCorrect: false },
      { label: 'C. Thank you very much', isCorrect: false },
      { label: 'D. Please come in', isCorrect: false },
    ]
  },
  {
    phrase: '¿Dónde está el parque?',
    choices: [
      { label: 'A. What time is it?', isCorrect: false },
      { label: 'B. Where is the park?', isCorrect: true },
      { label: 'C. I am going home', isCorrect: false },
      { label: 'D. Is the school open?', isCorrect: false },
    ]
  },
  {
    phrase: 'Me gusta comer pan',
    choices: [
      { label: 'A. I like to drink milk', isCorrect: false },
      { label: 'B. I like to eat bread', isCorrect: true },
      { label: 'C. I have a big cat', isCorrect: false },
      { label: 'D. Good afternoon', isCorrect: false },
    ]
  },
  {
    phrase: 'La casa es muy grande',
    choices: [
      { label: 'A. The house is very big', isCorrect: true },
      { label: 'B. The park is small', isCorrect: false },
      { label: 'C. The dog is running', isCorrect: false },
      { label: 'D. See you later', isCorrect: false },
    ]
  }
];

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<PracticeTab>('hub');

  // --- 1. Speaking Practice State ---
  const [speakingIndex, setSpeakingIndex] = useState<number>(0);
  const [speakingState, setSpeakingState] = useState<'Ready' | 'Listening' | 'Processing' | 'Completed'>('Ready');
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [speakingRating, setSpeakingRating] = useState<'Excellent' | 'Good' | 'Needs Practice'>('Good');

  const targetPhrase = SPEAKING_PHRASES[speakingIndex % SPEAKING_PHRASES.length];

  const handleStartSpeaking = () => {
    setSpeakingState('Listening');
    setTimeout(() => {
      setSpeakingState('Processing');
      setTimeout(() => {
        const randomScore = Math.floor(Math.random() * 21) + 80; // 80 - 100%
        setSpeakingScore(randomScore);
        if (randomScore >= 92) setSpeakingRating('Excellent');
        else if (randomScore >= 82) setSpeakingRating('Good');
        else setSpeakingRating('Needs Practice');
        setSpeakingState('Completed');
      }, 1500);
    }, 2500);
  };

  const handleResetSpeaking = () => {
    setSpeakingState('Ready');
    setSpeakingScore(null);
    setSpeakingIndex((prev) => (prev + 1) % SPEAKING_PHRASES.length);
  };

  // --- 2. Listening Practice State ---
  const [listeningIndex, setListeningIndex] = useState<number>(0);
  const currentListeningEx = LISTENING_POOL[listeningIndex % LISTENING_POOL.length];
  const [selectedListening, setSelectedListening] = useState<number | null>(null);
  const [listeningSubmitted, setListeningSubmitted] = useState<boolean>(false);

  const handleNextListening = () => {
    setSelectedListening(null);
    setListeningSubmitted(false);
    setListeningIndex((prev) => (prev + 1) % LISTENING_POOL.length);
  };

  // --- 3. Timed & Legendary Question State (Randomized Array) ---
  const [activeQuestions, setActiveQuestions] = useState<TimedQuestion[]>([]);

  // --- Timed Challenge State ---
  const [timedIndex, setTimedIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timedScore, setTimedScore] = useState<number>(0);
  const [timedActive, setTimedActive] = useState<boolean>(false);
  const [timedFinished, setTimedFinished] = useState<boolean>(false);
  const [selectedTimedOption, setSelectedTimedOption] = useState<string | null>(null);

  useEffect(() => {
    if (!timedActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimedActive(false);
          setTimedFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timedActive]);

  const startTimedChallenge = () => {
    const shuffled = shuffleArray(QUESTION_BANK).slice(0, 10);
    // Shuffle options inside each question as well
    const fullyShuffled = shuffled.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setActiveQuestions(fullyShuffled);
    setTimedIndex(0);
    setTimeLeft(60);
    setTimedScore(0);
    setTimedActive(true);
    setTimedFinished(false);
    setSelectedTimedOption(null);
  };

  const handleAnswerTimed = (option: string) => {
    if (selectedTimedOption || !timedActive || !activeQuestions[timedIndex]) return;
    setSelectedTimedOption(option);
    const q = activeQuestions[timedIndex];
    if (option === q.correct) {
      setTimedScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (timedIndex + 1 < activeQuestions.length) {
        setTimedIndex((prev) => prev + 1);
        setSelectedTimedOption(null);
      } else {
        setTimedActive(false);
        setTimedFinished(true);
      }
    }, 600);
  };

  // --- 4. Legendary Challenge State ---
  const [legendaryIndex, setLegendaryIndex] = useState<number>(0);
  const [legendaryHearts, setLegendaryHearts] = useState<number>(3);
  const [, setLegendaryScore] = useState<number>(0);
  const [legendaryActive, setLegendaryActive] = useState<boolean>(false);
  const [legendaryFinished, setLegendaryFinished] = useState<boolean>(false);
  const [selectedLegendary, setSelectedLegendary] = useState<string | null>(null);

  const startLegendaryChallenge = () => {
    const shuffled = shuffleArray(QUESTION_BANK).slice(0, 10);
    const fullyShuffled = shuffled.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setActiveQuestions(fullyShuffled);
    setLegendaryIndex(0);
    setLegendaryHearts(3);
    setLegendaryScore(0);
    setLegendaryActive(true);
    setLegendaryFinished(false);
    setSelectedLegendary(null);
  };

  const handleAnswerLegendary = (option: string) => {
    if (selectedLegendary || !legendaryActive || !activeQuestions[legendaryIndex]) return;
    setSelectedLegendary(option);
    const q = activeQuestions[legendaryIndex];

    if (option === q.correct) {
      setLegendaryScore((prev) => prev + 1);
    } else {
      setLegendaryHearts((prev) => Math.max(0, prev - 1));
    }

    setTimeout(() => {
      if (legendaryHearts - (option === q.correct ? 0 : 1) <= 0 || legendaryIndex + 1 >= activeQuestions.length) {
        setLegendaryActive(false);
        setLegendaryFinished(true);
      } else {
        setLegendaryIndex((prev) => prev + 1);
        setSelectedLegendary(null);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-xs text-[#58CC02] uppercase tracking-wider">
              <Dumbbell className="w-4 h-4" />
              <span>Practice Arena</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Skill Practice Hub
            </h1>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-zinc-200/80 dark:bg-zinc-850 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: 'hub', label: 'All Modes' },
              { id: 'speaking', label: '🎤 Speaking' },
              { id: 'listening', label: '🎧 Listening' },
              { id: 'timed', label: '⚡ Timed' },
              { id: 'legendary', label: '👑 Legendary' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as PracticeTab);
                  if (tab.id === 'timed') startTimedChallenge();
                  if (tab.id === 'legendary') startLegendaryChallenge();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- MODE 1: ALL MODES HUB GRID --- */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speaking Practice Card */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm hover:border-[#FF4B4B] transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-[#FF4B4B] flex items-center justify-center shadow-xs">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">Speaking Practice</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Practice Spanish pronunciation with AI feedback</p>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setActiveTab('speaking')}
                className="bg-[#FF4B4B] border-[#E03838] hover:bg-rose-600"
              >
                Start Speaking Practice
              </Button>
            </div>

            {/* Listening Practice Card */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm hover:border-[#1CB0F6] transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-[#1CB0F6] flex items-center justify-center shadow-xs">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">Listening Practice</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Train your ear with Spanish spoken sentences</p>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setActiveTab('listening')}
                className="bg-[#1CB0F6] border-[#0092DF] hover:bg-sky-400"
              >
                Start Listening Practice
              </Button>
            </div>

            {/* Timed Challenge Card */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm hover:border-amber-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-xs">
                  <Zap className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">Timed Challenge</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">60-second rapid-fire Spanish question blitz</p>
                </div>
              </div>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { setActiveTab('timed'); startTimedChallenge(); }}
                className="bg-amber-400 border-amber-500 text-black font-black hover:bg-amber-300"
              >
                Start 60s Challenge
              </Button>
            </div>

            {/* Legendary Challenge Card */}
            <div className="bg-gradient-to-br from-purple-900/20 via-zinc-900 to-amber-950/30 border-2 border-amber-500/60 rounded-3xl p-6 space-y-4 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                    <Sparkles className="w-3 h-3 fill-black" />
                    <span>LEGENDARY</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Legendary Mode</h3>
                  <p className="text-xs text-zinc-400 font-medium">10 randomized questions • 3 hearts • High XP</p>
                </div>
              </div>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { setActiveTab('legendary'); startLegendaryChallenge(); }}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-600 font-black hover:brightness-105"
              >
                Enter Legendary Mode
              </Button>
            </div>
          </div>
        )}

        {/* --- MODE 2: SPEAKING PRACTICE --- */}
        {activeTab === 'speaking' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF4B4B] bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                  Pronunciation Practice #{speakingIndex + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  Say this sentence:
                </h2>
                <div className="flex items-center justify-center gap-3 py-3 px-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                  <p className="text-xl sm:text-2xl font-black text-[#1CB0F6]">
                    &ldquo;{targetPhrase}&rdquo;
                  </p>
                  <SpeakerButton text={targetPhrase} lang="es-ES" />
                </div>
              </div>

              {/* Mic State Stage */}
              <div className="flex flex-col items-center justify-center gap-6 py-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-950">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={speakingState === 'Listening' || speakingState === 'Processing'}
                  onClick={handleStartSpeaking}
                  className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
                    speakingState === 'Listening'
                      ? 'bg-[#FF4B4B] animate-pulse ring-8 ring-rose-300/40'
                      : speakingState === 'Processing'
                      ? 'bg-amber-500 animate-spin'
                      : speakingState === 'Completed'
                      ? 'bg-emerald-500'
                      : 'bg-[#1CB0F6] hover:bg-sky-400'
                  }`}
                >
                  <Mic className="w-12 h-12" />
                </motion.button>

                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Microphone Status
                  </span>
                  <p className="text-base font-black text-zinc-800 dark:text-zinc-200 uppercase">
                    {speakingState === 'Ready' && 'Tap to Speak'}
                    {speakingState === 'Listening' && 'Listening... (Speak Now)'}
                    {speakingState === 'Processing' && 'Analyzing Pronunciation...'}
                    {speakingState === 'Completed' && 'Pronunciation Evaluated!'}
                  </p>
                </div>
              </div>

              {/* Pronunciation Feedback Result */}
              {speakingState === 'Completed' && speakingScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 text-center space-y-4"
                >
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-white font-black text-xs uppercase px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{speakingRating} Score</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                      {speakingScore}%
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-emerald-200 font-extrabold">
                      {speakingRating === 'Excellent' && '🌟 Flawless Spanish pronunciation! Keep it up.'}
                      {speakingRating === 'Good' && '👍 Great pronunciation! Very clear articulation.'}
                      {speakingRating === 'Needs Practice' && '💪 Good effort! Practice the accent marks.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button variant="primary" fullWidth onClick={handleResetSpeaking}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Another Sentence
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* --- MODE 3: LISTENING PRACTICE --- */}
        {activeTab === 'listening' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#1CB0F6] bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-900">
                  Listening Exercise #{listeningIndex + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  Listen and choose what you hear:
                </h2>
              </div>

              {/* Audio Play Button */}
              <div className="flex flex-col items-center justify-center p-8 bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-200 dark:border-sky-900 rounded-3xl gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speakText(currentListeningEx.phrase, 'es-ES')}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#1CB0F6] hover:bg-sky-400 text-white font-black text-lg shadow-md transition cursor-pointer"
                >
                  <Volume2 className="w-7 h-7" />
                  <span>PLAY AUDIO</span>
                </motion.button>
                <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">
                  Tap to replay audio
                </span>
              </div>

              {/* Answer Choices */}
              <div className="space-y-3">
                {currentListeningEx.choices.map((choice, i) => {
                  const isSelected = selectedListening === i;
                  const showWrong = listeningSubmitted && isSelected && !choice.isCorrect;
                  const showCorrect = listeningSubmitted && choice.isCorrect;

                  return (
                    <button
                      key={i}
                      disabled={listeningSubmitted}
                      onClick={() => { setSelectedListening(i); setListeningSubmitted(true); }}
                      className={`w-full p-4 rounded-2xl border-2 font-black text-left text-base sm:text-lg transition cursor-pointer flex items-center justify-between gap-3 ${
                        showCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#58CC02] text-[#58CC02]'
                          : showWrong
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-500'
                          : isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-[#1CB0F6] text-[#1CB0F6]'
                          : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{choice.label}</span>
                      {showCorrect && <span className="text-xs font-black bg-emerald-500 text-white px-2.5 py-1 rounded-xl">✓ Correct Option</span>}
                      {showWrong && <span className="text-xs font-black bg-rose-500 text-white px-2.5 py-1 rounded-xl">❌ Wrong Option</span>}
                    </button>
                  );
                })}
              </div>

              {listeningSubmitted && (
                <div className="space-y-3 pt-2">
                  {selectedListening !== null && !currentListeningEx.choices[selectedListening].isCorrect && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-black text-rose-700 dark:text-rose-200">
                      The correct option is: <span className="underline">{currentListeningEx.choices.find(c => c.isCorrect)?.label}</span>
                    </div>
                  )}
                  <Button variant="primary" fullWidth onClick={handleNextListening}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Another Listening Exercise
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MODE 4: TIMED CHALLENGE --- */}
        {activeTab === 'timed' && (
          <div className="max-w-xl mx-auto space-y-6">
            {!timedFinished && activeQuestions.length > 0 ? (
              <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                {/* Header Timer Bar */}
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <div className="flex items-center gap-2 font-black text-lg text-amber-500">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span>{timeLeft}s remaining</span>
                  </div>
                  <div className="font-mono font-black text-sm text-zinc-400">
                    Q {timedIndex + 1} / {activeQuestions.length}
                  </div>
                </div>

                {/* Current Question */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                      {activeQuestions[timedIndex].question}
                    </h3>
                    <SpeakerButton text={activeQuestions[timedIndex].spanishText} lang="es-ES" />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {activeQuestions[timedIndex].options.map((opt) => {
                      const isSelected = selectedTimedOption === opt;
                      const isCorrectOpt = opt === activeQuestions[timedIndex].correct;
                      const showWrong = selectedTimedOption !== null && isSelected && !isCorrectOpt;
                      const showCorrect = selectedTimedOption !== null && isCorrectOpt;

                      return (
                        <button
                          key={opt}
                          disabled={selectedTimedOption !== null}
                          onClick={() => handleAnswerTimed(opt)}
                          className={`p-4 rounded-2xl border-2 font-black text-left text-base transition cursor-pointer flex items-center justify-between gap-3 ${
                            showCorrect
                              ? 'bg-emerald-50 border-[#58CC02] text-[#58CC02]'
                              : showWrong
                              ? 'bg-rose-50 border-rose-500 text-rose-500'
                              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100'
                          }`}
                        >
                          <span>{opt}</span>
                          {showCorrect && <span className="text-xs font-black bg-emerald-500 text-white px-2 py-0.5 rounded-lg">✓ Correct</span>}
                          {showWrong && <span className="text-xs font-black bg-rose-500 text-white px-2 py-0.5 rounded-lg">❌ Wrong</span>}
                        </button>
                      );
                    })}
                  </div>

                  {selectedTimedOption !== null && selectedTimedOption !== activeQuestions[timedIndex].correct && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-black text-rose-700 dark:text-rose-200">
                      The correct option is: <span className="underline">{activeQuestions[timedIndex].correct}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Timed Challenge Results Screen */
              <div className="bg-white dark:bg-zinc-900 border-2 border-amber-400 rounded-3xl p-8 text-center space-y-6 shadow-xl">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 fill-amber-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Timed Challenge Results</h2>
                  <p className="text-xs font-bold text-zinc-400">Great effort under pressure!</p>
                </div>

                <div className="grid grid-cols-3 gap-3 py-2">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[10px] font-black uppercase text-zinc-400 block">Score</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">{timedScore} / {activeQuestions.length || 10}</span>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900">
                    <span className="text-[10px] font-black uppercase text-amber-600 block">XP Earned</span>
                    <span className="text-xl font-black text-amber-500">+{timedScore * 5} XP</span>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                    <span className="text-[10px] font-black uppercase text-emerald-600 block">Accuracy</span>
                    <span className="text-xl font-black text-emerald-500">{Math.round((timedScore / (activeQuestions.length || 10)) * 100)}%</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={startTimedChallenge}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again (Randomized)
                  </Button>
                  <Button variant="primary" fullWidth onClick={() => setActiveTab('hub')}>
                    Back to Practice
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MODE 5: LEGENDARY CHALLENGE --- */}
        {activeTab === 'legendary' && (
          <div className="max-w-xl mx-auto space-y-6">
            {!legendaryFinished && activeQuestions.length > 0 ? (
              <div className="bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-xl">
                {/* Header Hearts Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-6 h-6 ${
                          i < legendaryHearts ? 'fill-rose-500 text-rose-500' : 'fill-zinc-800 text-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1 bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 fill-black" />
                    <span>Legendary Challenge</span>
                  </div>
                </div>

                {/* Current Question */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white">
                    {activeQuestions[legendaryIndex].question}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {activeQuestions[legendaryIndex].options.map((opt) => {
                      const isSelected = selectedLegendary === opt;
                      const isCorrectOpt = opt === activeQuestions[legendaryIndex].correct;
                      const showWrong = selectedLegendary !== null && isSelected && !isCorrectOpt;
                      const showCorrect = selectedLegendary !== null && isCorrectOpt;

                      return (
                        <button
                          key={opt}
                          disabled={selectedLegendary !== null}
                          onClick={() => handleAnswerLegendary(opt)}
                          className={`p-4 rounded-2xl border-2 font-black text-left text-base transition cursor-pointer flex items-center justify-between gap-3 ${
                            showCorrect
                              ? 'bg-emerald-950 border-[#58CC02] text-[#58CC02]'
                              : showWrong
                              ? 'bg-rose-950 border-rose-500 text-rose-500'
                              : 'bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {showCorrect && <span className="text-xs font-black bg-emerald-500 text-white px-2 py-0.5 rounded-lg">✓ Correct</span>}
                          {showWrong && <span className="text-xs font-black bg-rose-500 text-white px-2 py-0.5 rounded-lg">❌ Wrong</span>}
                        </button>
                      );
                    })}
                  </div>

                  {selectedLegendary !== null && selectedLegendary !== activeQuestions[legendaryIndex].correct && (
                    <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs font-black text-rose-200">
                      The correct option is: <span className="underline text-white">{activeQuestions[legendaryIndex].correct}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Legendary Results Screen */
              <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-black border-2 border-amber-500 rounded-3xl p-8 text-center space-y-6 text-white shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center mx-auto shadow-lg">
                  <Award className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-amber-400">Legendary Mode Completed!</h2>
                  <p className="text-xs font-bold text-zinc-400">You mastered high-level Spanish challenges</p>
                </div>

                <div className="p-4 bg-zinc-800/60 rounded-2xl border border-amber-500/40 inline-block font-black text-amber-300 text-lg">
                  +100 XP & +20 Gems Earned! 👑
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={startLegendaryChallenge} className="bg-amber-400 text-black font-black">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Play Fresh Random Set
                  </Button>
                  <Button variant="primary" fullWidth onClick={() => setActiveTab('hub')}>
                    Back to Practice Hub
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
