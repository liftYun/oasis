'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import DescriptionModal from './DescriptionModal';

interface StayDescriptionProps {
  description: string;
  maxGuests: number;
}

export function StayDescription({ description, maxGuests }: StayDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const [modalOpen, setModalOpen] = useState(false);

  const PREVIEW_LENGTH = 100;
  const isLong = description.length > PREVIEW_LENGTH;

  const textToShow = expanded
    ? description
    : isLong
      ? description.slice(0, PREVIEW_LENGTH) + '...'
      : description;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-blue-500 rounded-sm" />
        {t.detail.infoTitle}
      </h2>
      <div className="inline-flex items-center gap-2 rounded-md mt-2 bg-blue-50 px-3 py-2 text-sm text-primary mb-4">
        <Users className="h-4 w-4" strokeWidth={2} />
        <span>{t.description.maxGuests(maxGuests)}</span>
      </div>

      <p className="text-gray-600 whitespace-pre-line rounded-md bg-gray-100 p-4">{textToShow}</p>

      {isLong && (
        <button
          onClick={() => setModalOpen(true)}
          className="mt-3 w-full rounded-md bg-gray-100 py-3 text-sm text-gray-600 hover:bg-gray-200"
        >
          {t.description.more}
        </button>
      )}

      <DescriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        description={description}
      />
    </section>
  );
}
