'use client';

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakText } from '@/lib/tts';

export interface SpeakerButtonProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  lang = 'es-ES',
  size = 'md',
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    speakText(
      text,
      lang,
      1.0,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const sizeClasses = {
    sm: 'p-1.5 rounded-xl',
    md: 'p-2.5 rounded-2xl',
    lg: 'p-3.5 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleSpeak}
      type="button"
      aria-label={`Listen to ${text}`}
      title={`Listen: "${text}"`}
      className={`inline-flex items-center justify-center bg-sky-100 dark:bg-sky-950/60 text-[#1CB0F6] dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/60 transition cursor-pointer shrink-0 border border-sky-200 dark:border-sky-800 ${
        isSpeaking ? 'ring-4 ring-sky-300/50 animate-pulse' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      <Volume2 className={iconSizes[size]} />
    </button>
  );
};
