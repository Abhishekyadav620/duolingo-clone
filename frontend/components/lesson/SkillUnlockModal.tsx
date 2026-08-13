'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface SkillUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedSkillTitle?: string;
}

export const SkillUnlockModal: React.FC<SkillUnlockModalProps> = ({
  isOpen,
  onClose,
  unlockedSkillTitle = 'Next Skill',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Skill Unlocked!">
      <div className="space-y-6 text-center">
        <div className="flex justify-center pt-2">
          <Mascot mood="celebrate" size="lg" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-black px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Skill Unlocked
          </span>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight pt-1">
            {unlockedSkillTitle}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            You&apos;ve unlocked new Spanish lessons to continue your journey!
          </p>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="lg" fullWidth onClick={onClose}>
            Continue to Path
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
