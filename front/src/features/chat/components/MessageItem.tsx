'use client';

import Image from 'next/image';
import TranslateIcon from '@/assets/icons/translate.png';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';

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
  const bubbleBase = 'max-w-[78%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm';
  const bubbleClass = message.isMine
    ? `${bubbleBase} bg-black text-white rounded-br-md`
    : `${bubbleBase} bg-gray-100 text-gray-600 rounded-bl-md`;

  return (
    <div className="mb-6">
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
          <button
            type="button"
            onClick={() => onClickTranslate?.(message.id)}
            className="ml-2 mt-auto mb-2 p-1 rounded hover:bg-gray-100 active:bg-gray-200"
            aria-label={t.seeMore}
          >
            <Image src={TranslateIcon} alt={t.seeMore} width={22} height={22} />
          </button>
        )}
      </div>
    </div>
  );
}
