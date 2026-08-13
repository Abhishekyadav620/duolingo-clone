'use client';

import React, { createContext, useContext, useState } from 'react';

export type LanguageOption = 'Spanish' | 'English' | 'French' | 'German' | 'Japanese';

interface SettingsContextType {
  activeLanguage: LanguageOption;
  setActiveLanguage: (lang: LanguageOption) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLanguage, setActiveLanguageState] = useState<LanguageOption>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('learnly_active_lang') as LanguageOption | null;
      if (savedLang) return savedLang;
    }
    return 'Spanish';
  });

  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedNotif = localStorage.getItem('learnly_notif');
      if (savedNotif !== null) return savedNotif === 'true';
    }
    return true;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('learnly_sound');
      if (savedSound !== null) return savedSound === 'true';
    }
    return true;
  });

  const [speechEnabled, setSpeechEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedSpeech = localStorage.getItem('learnly_speech');
      if (savedSpeech !== null) return savedSpeech === 'true';
    }
    return true;
  });

  const setActiveLanguage = (lang: LanguageOption) => {
    setActiveLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('learnly_active_lang', lang);
    }
  };

  const setNotificationsEnabled = (val: boolean) => {
    setNotificationsEnabledState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('learnly_notif', String(val));
    }
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('learnly_sound', String(val));
    }
  };

  const setSpeechEnabled = (val: boolean) => {
    setSpeechEnabledState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('learnly_speech', String(val));
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        activeLanguage,
        setActiveLanguage,
        notificationsEnabled,
        setNotificationsEnabled,
        soundEnabled,
        setSoundEnabled,
        speechEnabled,
        setSpeechEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
