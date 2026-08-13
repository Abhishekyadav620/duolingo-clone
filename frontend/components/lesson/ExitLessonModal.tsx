'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';

export interface ExitLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitLessonModal: React.FC<ExitLessonModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Lesson?">
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          Are you sure you want to leave? Your progress in this session will not be saved.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={onClose}>
            Stay
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirmExit}>
            Leave
          </Button>
        </div>
      </div>
    </Modal>
  );
};
