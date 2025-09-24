'use client';

import { usePathname } from 'next/navigation';
import TabBar from '@/components/organisms/tabbar/TabBar';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTabBar =
    pathname.startsWith('/my-profile/reservations') || pathname.startsWith('/my-profile/reviews');

  return (
    <>
      <section className="items-center justify-center overflow-y-auto scrollbar-hide">
        {children}
      </section>
      {!hideTabBar && <TabBar activeKey="profile" />}
    </>
  );
}
