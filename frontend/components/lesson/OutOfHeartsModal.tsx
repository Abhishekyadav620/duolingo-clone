'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Heart, RefreshCw } from 'lucide-react';
import { refillHearts } from '@/lib/api';

export interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefillSuccess: (newHearts: number) => void;
  onExit: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  onRefillSuccess,
  onExit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefill = async () => {
    setLoading(true);
    try {
      const res = await refillHearts();
      onRefillSuccess(res.hearts);
    } catch {
      // Fallback refill if API network hiccup
      onRefillSuccess(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Out of Hearts!">
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto animate-pulse">
          <Heart className="w-8 h-8 fill-rose-500" />
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          You need hearts to keep practicing. Refill your hearts to continue learning!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={onExit} disabled={loading}>
            Exit Lesson
          </Button>
          <Button variant="primary" fullWidth onClick={handleRefill} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refill Hearts
          </Button>
        </div>
      </div>
    </Modal>
  );
};
