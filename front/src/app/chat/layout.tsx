'use client';

import TabBar from '@/components/organisms/tabbar/TabBar';
import { usePathname } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatDetail = pathname?.startsWith('/chat/') && pathname !== '/chat';

  return (
    <>
      <section
        className={`
          min-h-screen items-center justify-center overflow-y-auto scrollbar-hide max-w-[478px]
          ${isChatDetail ? 'px-0' : 'px-6'}
        `}
      >
        {children}
      </section>
      {!isChatDetail && <TabBar activeKey="chat" />}
    </>
  );
}
