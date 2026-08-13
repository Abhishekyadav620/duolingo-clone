'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot } from '../ui/Mascot';
import { Button } from '../ui/Button';
import { askAITutor } from '@/lib/api';
import { Send, Bot, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: '¡Hola! I am Lingo Buddy, your AI Spanish tutor. Ask me anything about Spanish grammar, vocabulary, or conjugations!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    "What is the difference between 'ser' and 'estar'?",
    "How do I conjugate 'comer' in present tense?",
    "When do I use 'buenos días' vs 'buenas tardes'?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsgId = `user-${messages.length}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const res = await askAITutor(query.trim());
      const aiMsgId = `ai-${messages.length + 1}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: res.answer
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${messages.length + 1}`,
        sender: 'ai',
        text: '¡Hola! I am Lingo Buddy. I am having trouble connecting to the backend server. Please verify your backend server connection.'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      {/* Tutor Header Card */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mascot mood={loading ? 'thinking' : 'happy'} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#3C3C3C] dark:text-white tracking-tight">
                AI Spanish Tutor
              </h1>
              <span className="bg-[#1CB0F6]/15 text-[#1CB0F6] border border-[#1CB0F6]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 inline mr-1" /> Gemini
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-400 mt-0.5">
              Ask Lingo Buddy any questions about your Spanish journey!
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mr-1">
          Suggestions:
        </span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs font-black text-[#1CB0F6] bg-sky-50 dark:bg-sky-950/60 border-2 border-sky-200 dark:border-sky-800 hover:border-[#1CB0F6] rounded-2xl px-3 py-1.5 transition select-none cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-lg p-4 rounded-3xl font-bold text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1CB0F6] text-white rounded-br-none shadow-sm'
                      : 'bg-[#F7F7F7] dark:bg-zinc-800 text-[#3C3C3C] dark:text-zinc-100 border-2 border-[#E5E5E5] dark:border-zinc-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <Mascot mood="thinking" size="sm" />
              <div className="bg-[#F7F7F7] dark:bg-zinc-800 border-2 border-[#E5E5E5] dark:border-zinc-700 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs font-black text-zinc-400 flex items-center gap-2">
                <span className="animate-pulse">● ● ●</span> Thinking...
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/50 rounded-2xl text-xs font-bold text-red-600 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Lingo Buddy a Spanish question..."
          disabled={loading}
          className="flex-1 bg-white dark:bg-zinc-900 border-2 border-[#E5E5E5] dark:border-zinc-800 focus:border-[#1CB0F6] rounded-2xl px-5 py-3 text-sm font-bold text-[#3C3C3C] dark:text-zinc-100 focus:outline-none transition shadow-sm"
        />
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          disabled={!inputMessage.trim() || loading}
          className="shrink-0"
        >
          <Send className="w-5 h-5 mr-1" />
          Ask
        </Button>
      </form>
    </div>
  );
};
