'use client';

import TabBar from '@/components/organisms/tabbar/TabBar';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="min-h-screen items-center justify-center">{children}</section>
      <TabBar activeKey="smart-key" />
    </>
  );
}
