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
    <div aria-modal role="dialog" className="fixed inset-0 z-50">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="absolute left-1/2 top-1/2 w-[88%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 shadow-2xl">
        {title && (
          <h3 className="mb-2 text-center text-lg font-extrabold text-gray-600">{title}</h3>
        )}
        {description && (
          <p className="mb-6 text-center text-sm leading-6 text-gray-400">{description}</p>
        )}
        <div className="grid grid-cols-2 gap-2">{children}</div>
      </div>
    </div>
  );
}
