'use client';

import Image from 'next/image';
import TranslateIcon from '@/assets/icons/translate.png';

export type MessageItemModel = {
  id: string;
  content: string;
  isMine: boolean; // true: 내 메시지, false: 상대 메시지
  timestamp: string; // 이미 포맷된 표시용 텍스트
};

interface MessageItemProps {
  message: MessageItemModel;
  onClickTranslate?: (id: string) => void; // UI만 존재. 동작은 추후
}

export default function MessageItem({ message, onClickTranslate }: MessageItemProps) {
  const bubbleBase = 'max-w-[78%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm';
  const bubbleClass = message.isMine
    ? `${bubbleBase} bg-black text-white rounded-br-md`
    : `${bubbleBase} bg-gray-100 text-gray-600 rounded-bl-md`;

  return (
    <div className="mb-6">
      <div
        className={`mb-2 text-[10px] text-gray-300 ${message.isMine ? 'text-right pr-4' : 'text-left pl-4'}`}
      >
        {message.timestamp}
      </div>

      <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={bubbleClass}>{message.content}</div>

        {!message.isMine && (
          <button
            type="button"
            onClick={() => onClickTranslate?.(message.id)}
            className="ml-2 mt-auto mb-2 p-1 rounded hover:bg-gray-100 active:bg-gray-200"
            aria-label="translate-message"
          >
            <Image src={TranslateIcon} alt="translate" width={22} height={22} />
          </button>
        )}
      </div>
    </div>
  );
}
