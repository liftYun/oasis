// 채팅 유저 썸네일 컴포넌트
'use client';

import Image, { type StaticImageData } from 'next/image';
import type { CSSProperties } from 'react';
import PreviewUser from '@/assets/icons/preview-user.png';

type ChatUserThumbnailProps = {
  src?: string | StaticImageData;
  alt?: string;
  size?: number; // px
  className?: string;
};

export function ChatUserThumbnail({
  src,
  alt = 'user',
  size = 48,
  className,
}: ChatUserThumbnailProps) {
  const wrapperStyle: CSSProperties = { width: size, height: size };
  const safeSrc = src && typeof src === 'string' && src.length > 0 ? src : undefined;

  return (
    <div
      className={['relative overflow-hidden rounded-full bg-gray-200 shadow-md', className]
        .filter(Boolean)
        .join(' ')}
      style={wrapperStyle}
      aria-label="chat-user-thumbnail"
    >
      {/* Next/Image fill 사용: 기본 이미지 */}
      <Image
        src={safeSrc ?? PreviewUser}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={false}
      />
    </div>
  );
}

export default ChatUserThumbnail;
