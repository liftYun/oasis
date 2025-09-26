'use client';

import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { Globe } from 'lucide-react';

export type MessageItemModel = {
  id: string;
  content: string;
  isMine: boolean; // true: 내 메시지, false: 상대 메시지
  timestamp?: string; // 표시용 텍스트(같은 분에서는 첫 메시지만 세팅)
};

interface MessageItemProps {
  message: MessageItemModel;
  onClickTranslate?: (id: string) => void; // UI만 존재. 동작은 추후
  translated?: boolean; // 번역 완료 여부에 따라 버튼 숨김
}

export default function MessageItem({ message, onClickTranslate, translated }: MessageItemProps) {
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  const bubbleBase = 'max-w-[72%] px-3 py-2.5 rounded-lg text-sm leading-snug';

  const bubbleClass = message.isMine
    ? `${bubbleBase} bg-primary text-white rounded-br-none`
    : `${bubbleBase} bg-white text-gray-600 rounded-bl-none`;

  return (
    <div className="mb-3">
      {message.timestamp && (
        <div
          className={`mb-2 text-[10px] text-gray-300 ${message.isMine ? 'text-right pr-4' : 'text-left pl-4'}`}
        >
          {message.timestamp}
        </div>
      )}

      <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={bubbleClass}>{message.content}</div>

        {!message.isMine && (
          <div className="relative group ml-2 mt-auto mb-2">
            <button
              type="button"
              onClick={() => !translated && onClickTranslate?.(message.id)}
              className={`p-1 rounded-full
        ${
          translated
            ? 'bg-gradient-to-r from-primary to-green text-white pointer-events-none'
            : 'active:bg-gray-200'
        }`}
              aria-label={t.seeMore}
            >
              <Globe
                size={18}
                className={translated ? 'text-white' : 'text-gray-300 hover:text-gray-600'}
              />
            </button>

            {!translated && (
              <span
                className="absolute top-full mt-1 left-1/2 -translate-x-1/2
               whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white
               opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {t.tooltipTranslate ?? '번역하기'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
