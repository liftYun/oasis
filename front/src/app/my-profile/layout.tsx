'use client';

import { usePathname } from 'next/navigation';
import TabBar from '@/components/organisms/tabbar/TabBar';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTabBar = pathname.startsWith('/my-profile/reservations');

  return (
    <>
      <section className="items-center justify-center">{children}</section>
      {!hideTabBar && <TabBar activeKey="profile" />}
    </>
  );
}
