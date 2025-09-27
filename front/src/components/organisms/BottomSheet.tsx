'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type BottomSheetProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div aria-modal role="dialog" className="fixed inset-0 z-[9999]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[480px] rounded-t-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5">
          <div className="h-1.5 w-12 rounded-full bg-gray-200 mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
          <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
          <button
            onClick={onClose}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
