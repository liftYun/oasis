'use client';

import TabBar from '@/components/organisms/tabbar/TabBar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        mx-auto w-full max-w-[480px]
        min-h-dvh
        flex flex-col flex-1
        px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        border-x border-gray-100
      "
    >
      {children}
      <TabBar activeKey="chat" />
    </div>
  );
}
