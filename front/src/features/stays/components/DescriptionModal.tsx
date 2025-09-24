'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stayDetailLocale } from '@/features/stays/locale';
import { useLanguage } from '@/features/language';

interface DescriptionModalProps {
  open: boolean;
  onClose: () => void;
  description: string;
}

export default function DescriptionModal({ open, onClose, description }: DescriptionModalProps) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-w-[480px] mx-auto shadow-xl h-[70vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="h-1.5 w-12 rounded-full bg-gray-200 mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">{t.detail.infoTitle}</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-600 bg-gray-100 rounded-md p-4 whitespace-pre-line">
                {description}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
