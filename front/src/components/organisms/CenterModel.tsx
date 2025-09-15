'use client';

import { useEffect } from 'react';

type CenterModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export function CenterModal({ open, title, description, onClose, children }: CenterModalProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70"
    >
      <div className="min-w-10 max-w-md mx-8 rounded-2xl bg-white p-7 shadow-2xl">
        {title && (
          <h3 className="mb-3 text-center text-lg font-extrabold text-gray-600">{title}</h3>
        )}
        {description && (
          <p className="mb-8 text-center text-sm leading-6 text-gray-500 whitespace-pre-line">
            {description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-5">{children}</div>
      </div>
    </div>
  );
}
