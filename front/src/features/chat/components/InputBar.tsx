'use client';

import { useState } from 'react';
import { SmilePlus, SendHorizontal } from 'lucide-react';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { notifyTooLong } from '@/features/chat/api/toastHelpers';

interface InputBarProps {
  onSend?: (text: string) => void; // UI 전용. 동작은 추후 연결
}

export default function InputBar({ onSend }: InputBarProps) {
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasShownTooLongToast, setHasShownTooLongToast] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !(e.nativeEvent as any).isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);

    // 500자 초과 시 토스트 표시 (한 번만)
    if (newText.length > 500 && !hasShownTooLongToast) {
      notifyTooLong(lang);
      setHasShownTooLongToast(true);
    } else if (newText.length <= 500) {
      setHasShownTooLongToast(false);
    }
  };

  return (
    <div
      id="chat-input-bar"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50  py-2"
    >
      <div className="mx-2 rounded-full border border-gray-200 bg-white px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600"
          aria-label={t.ariaOpenEmoji}
        >
          <SmilePlus className="text-lg text-gray-300" />
        </button>
        <input
          type="text"
          inputMode="text"
          enterKeyHint="send"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-base px-1"
          placeholder={t.inputPlaceholder}
          maxLength={500}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
          aria-label={t.ariaSend}
        >
          <SendHorizontal className="text-lg text-gray-300" />
        </button>
      </div>

      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-2 right-2 z-[60]">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={350}
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{
              showPreview: false,
            }}
          />
        </div>
      )}
    </div>
  );
}
