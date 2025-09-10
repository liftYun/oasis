'use client';

import TabBar from '@/components/organisms/TabBar';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="flex-1 flex items-center justify-center">{children}</section>
      <TabBar activeKey="home" onChange={() => {}} />
    </>
  );
}
