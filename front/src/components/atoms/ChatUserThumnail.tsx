// 채팅 유저 썸네일 컴포넌트
'use client';

import Image from 'next/image';
import PreviewUser from '@/assets/icons/preview-user.png';

type ChatUserThumbnailProps = {
  src?: string;
  alt?: string;
  size?: number; // px
  className?: string;
};

export function ChatUserThumnail({
  src,
  alt = 'user',
  size = 48,
  className,
}: ChatUserThumbnailProps) {
  const wrapperStyle: React.CSSProperties = { width: size, height: size };

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
        src={src ?? PreviewUser}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={false}
      />
    </div>
  );
}

export default ChatUserThumnail;
