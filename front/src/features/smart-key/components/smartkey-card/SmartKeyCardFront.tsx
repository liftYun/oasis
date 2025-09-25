'use client';

import type { KeyResponseDto } from '@/services/smartKey.types';
import { messages } from '@/features/smart-key/locale';

interface Props {
  keyData: KeyResponseDto;
  handleOpenDoor: (keyId: number) => void;
  lang: 'kor' | 'eng';
}

export function SmartKeyCardFront({ keyData, handleOpenDoor, lang }: Props) {
  const t = messages[lang] ?? messages.kor;

  return (
    <div
      className="absolute inset-0 p-8 rounded-xl bg-gradient-to-br from-primary/40 to-green/40 text-gray-600 flex flex-col justify-between"
      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{keyData.stayName}</h3>
          <p className="text-sm text-gray-600">{keyData.addressLine}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/50 text-xs">{keyData.status}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleOpenDoor(keyData.keyId);
        }}
        className="w-40 h-40 mx-auto rounded-full bg-white/50 text-gray-800 text-xl font-semibold flex items-center justify-center shadow-inner hover:bg-white/70 hover:scale-105 transition"
      >
        {t.card.openDoor}
      </button>

      <p className="text-center text-xs text-gray-700 mt-4 whitespace-pre-line leading-relaxed">
        {t.card.description}
      </p>
    </div>
  );
}
