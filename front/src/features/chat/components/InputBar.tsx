'use client';

import { useState, useRef, useEffect } from 'react';
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
  const emojiRef = useRef<HTMLDivElement>(null);

  // 이모지 창 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

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
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 pb-10 pt-5 px-4 bg-blue-50"
    >
      <div className="mx-2 rounded-full shadow bg-white px-3 py-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600"
          aria-label={t.ariaOpenEmoji}
        >
          <SmilePlus className="w-5 h-5 text-gray-300" />
        </button>
        <input
          type="text"
          inputMode="text"
          enterKeyHint="send"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm px-1"
          placeholder={t.inputPlaceholder}
          maxLength={500}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className={`flex-shrink-0 p-2 
    ${text.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-300'}`}
          aria-label={t.ariaSend}
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>

      {showEmojiPicker && (
        <div ref={emojiRef} className="absolute bottom-20 left-2 right-2 z-[60]">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="80%"
            height={350} // 크기 줄임
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
