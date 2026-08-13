'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Sparkles, Heart, ShieldCheck, Award } from 'lucide-react';
import { Button } from './Button';

interface SuperSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuperSubscriptionModal: React.FC<SuperSubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [showDemoAlert, setShowDemoAlert] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setShowDemoAlert(true);
  };

  const handleCloseAlert = () => {
    setShowDemoAlert(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-black border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative space-y-6 overflow-hidden"
        >
          {/* Background Glow Graphic */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20 tracking-widest">
              <Zap className="w-4 h-4 fill-black" />
              <span>LEARNLY SUPER</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white pt-1">
              Accelerate Your Spanish
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              No ads, unlimited hearts, and personalized practice insights.
            </p>
          </div>

          {/* Feature Checklist */}
          <div className="bg-zinc-850/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            {[
              { text: 'Unlimited Hearts — Never run out of attempts', icon: Heart, color: 'text-rose-400' },
              { text: 'Ad-Free Learning Experience', icon: ShieldCheck, color: 'text-emerald-400' },
              { text: 'Unlimited Practice Hub & Timed Challenges', icon: Zap, color: 'text-amber-400' },
              { text: 'Extra Progress & Speaking Insights', icon: Sparkles, color: 'text-sky-400' },
              { text: 'Exclusive Legendary Badge Challenges', icon: Award, color: 'text-purple-400' },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-zinc-200">
                  <span className="w-7 h-7 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${feat.color}`} />
                  </span>
                  <span>{feat.text}</span>
                </div>
              );
            })}
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-850 border-2 border-zinc-700 hover:border-amber-500/60 transition text-center space-y-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Monthly</span>
              <div className="text-xl font-black text-white">₹199<span className="text-xs text-zinc-400 font-normal">/mo</span></div>
              <span className="text-[10px] text-zinc-500 block">Flexible billing</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-zinc-850 border-2 border-amber-500 text-center space-y-1 relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                Best Value
              </span>
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">Yearly</span>
              <div className="text-xl font-black text-amber-400">₹1,499<span className="text-xs text-amber-200/60 font-normal">/yr</span></div>
              <span className="text-[10px] text-amber-200/60 block">Save 37%</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-600 font-black hover:brightness-105"
            >
              Start Free Trial
            </Button>
            <button
              onClick={handleSubscribe}
              className="w-full py-2.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            >
              Upgrade to Super
            </button>
          </div>

          {/* Demo Alert Overlay Modal */}
          {showDemoAlert && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border-2 border-amber-500 rounded-3xl p-6 text-center max-w-xs w-full space-y-4 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 fill-amber-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Demo Subscription</h3>
                  <p className="text-xs font-semibold text-zinc-400 leading-relaxed">
                    This is a demo subscription for testing. Real payments are not implemented.
                  </p>
                </div>
                <Button variant="primary" fullWidth onClick={handleCloseAlert}>
                  Got It!
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
