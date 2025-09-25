'use client';

import type { KeyResponseDto } from '@/services/smartKey.types';

interface Props {
  keys: KeyResponseDto[];
  activeIndex: number;
}

export function SmartKeyDots({ keys, activeIndex }: Props) {
  return (
    <div className="absolute bottom-36 inset-x-0 flex justify-center gap-2">
      {keys.map((k, i) => (
        <div
          key={k.keyId}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === activeIndex ? 'w-5 bg-gray-800' : 'w-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
