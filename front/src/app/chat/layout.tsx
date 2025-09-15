'use client';

import TabBar from '@/components/organisms/tabbar/TabBar';
import { usePathname } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatDetail = pathname?.startsWith('/chat/') && pathname !== '/chat';

  return (
    <div
      className={`
        mx-auto w-full max-w-[480px]
        min-h-dvh
        flex flex-col flex-1
        ${isChatDetail ? 'px-0' : 'px-6'} pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        border-x border-gray-100
      `}
    >
      {children}
      {!isChatDetail && <TabBar activeKey="chat" />}
    </div>
  );
}
