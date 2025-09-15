'use client';

import { useState } from 'react';
import { SmilePlus, SendHorizontal } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import MessageSendIcon from '@/assets/icons/messega-send.png';

interface InputBarProps {
  onSend?: (text: string) => void; // UI 전용. 동작은 추후 연결
}

export default function InputBar({ onSend }: InputBarProps) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white">
      <div className="mx-2 rounded-full border border-gray-200 bg-white px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600"
          aria-label="open-emoji-picker"
        >
          <SmilePlus className="text-lg text-gray-300" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm px-1"
          maxLength={500}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
          aria-label="send-message"
        >
          <SendHorizontal className="text-lg text-gray-300" />
        </button>
      </div>

      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-2 right-2 z-60">
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
