'use client';

import TabBar from '@/components/organisms/tabbar/TabBar';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="items-center justify-center">{children}</section>
      <TabBar activeKey="profile" />
    </>
  );
}
