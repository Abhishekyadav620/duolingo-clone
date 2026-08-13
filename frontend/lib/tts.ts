/**
 * Reusable Text-To-Speech (TTS) utility using the browser Web Speech API.
 */

export const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  Spanish: 'es-ES',
  English: 'en-US',
  French: 'fr-FR',
  German: 'de-DE',
  Japanese: 'ja-JP',
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const stopSpeech = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (
  text: string,
  languageOrLocale: string = 'es-ES',
  rate: number = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): void => {
  if (!isSpeechSynthesisSupported() || !text) {
    if (onEnd) onEnd();
    return;
  }

  stopSpeech();

  const locale = LANGUAGE_LOCALE_MAP[languageOrLocale] || languageOrLocale;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = rate;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};
