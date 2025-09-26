'use client';

import { KeyResponseDto } from '@/services/smartKey.types';

interface SmartKeySummaryBarProps {
  keys: KeyResponseDto[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function SmartKeySummaryBar({ keys, activeIndex, setActiveIndex }: SmartKeySummaryBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto py-3 px-2 pt-8 no-scrollbar items-center">
      {keys.map((key, i) => (
        <div
          key={key.keyId}
          className="flex flex-col items-center flex-shrink-0 cursor-pointer"
          onClick={() => setActiveIndex(i)}
        >
          <div
            className={`
    w-14 h-14 flex items-center justify-center transition-transform
  `}
          >
            {i === activeIndex ? (
              <div className="p-[3px] rounded-full bg-gradient-to-r from-primary to-green">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                  {key.thumbnailUrl ? (
                    <img
                      src={key.thumbnailUrl}
                      alt={key.stayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xs text-gray-500">
                      No Img
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full border border-gray-300 overflow-hidden">
                {key.thumbnailUrl ? (
                  <img
                    src={key.thumbnailUrl}
                    alt={key.stayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-xs text-gray-500">
                    No Img
                  </span>
                )}
              </div>
            )}
          </div>
          <span
            className={`
    mt-3 px-2 py-0.5 rounded-md text-xs truncate max-w-[70px] text-center transition
    ${i === activeIndex ? 'bg-primary/10 text-primary font-medium' : 'bg-gray-100 text-gray-600'}
  `}
          >
            {key.stayName ?? `Key ${i + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}
