'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Sparkles } from 'lucide-react';
import { useSettings, LanguageOption } from '@/context/SettingsContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LanguageMeta {
  name: LanguageOption;
  flag: string;
  native: string;
  available: boolean;
}

const LANGUAGES: LanguageMeta[] = [
  { name: 'Spanish', flag: '🇪🇸', native: 'Español', available: true },
  { name: 'English', flag: '🇺🇸', native: 'English', available: false },
  { name: 'French', flag: '🇫🇷', native: 'Français', available: false },
  { name: 'German', flag: '🇩🇪', native: 'Deutsch', available: false },
  { name: 'Japanese', flag: '🇯🇵', native: '日本語', available: false },
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { activeLanguage, setActiveLanguage } = useSettings();
  const [comingSoonLang, setComingSoonLang] = useState<LanguageOption | null>(null);

  if (!isOpen) return null;

  const handleSelectLanguage = (lang: LanguageMeta) => {
    if (lang.available) {
      setActiveLanguage(lang.name);
      setComingSoonLang(null);
      onClose();
    } else {
      setComingSoonLang(lang.name);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#58CC02]" />
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Select Course Language
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Cards */}
          <div className="space-y-3">
            {LANGUAGES.map((lang) => {
              const isSelected = activeLanguage === lang.name;
              return (
                <button
                  key={lang.name}
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#58CC02] text-zinc-900 dark:text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <h4 className="font-extrabold text-base leading-tight">{lang.name}</h4>
                      <p className="text-xs text-zinc-400 font-semibold">{lang.native}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="w-7 h-7 rounded-full bg-[#58CC02] text-white flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  ) : !lang.available ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span>Soon</span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Coming Soon Alert Card */}
          {comingSoonLang && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-4 text-center space-y-1.5"
            >
              <div className="inline-flex items-center gap-1.5 font-black text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{comingSoonLang} Course Coming Soon</span>
              </div>
              <p className="text-xs font-bold text-amber-950 dark:text-amber-100 leading-relaxed">
                The {comingSoonLang} course is currently under development. Spanish is fully unlocked and ready to play!
              </p>
            </motion.div>
          )}

          {/* Footer Action */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-extrabold text-sm uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
