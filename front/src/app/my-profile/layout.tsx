'use client';

import { usePathname } from 'next/navigation';
import TabBar from '@/components/organisms/tabbar/TabBar';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTabBar =
    pathname.startsWith('/my-profile/reservations') ||
    pathname.startsWith('/my-profile/reviews') ||
    pathname.startsWith('/my-profile/manage-stay') ||
    pathname.startsWith('/my-profile/favorite') ||
    pathname.startsWith('/my-profile/policy') ||
    pathname.startsWith('/my-profile/blockchain');

  return (
    <>
      <section className="items-center justify-center overflow-y-auto scrollbar-hide">
        {children}
      </section>
      {!hideTabBar && <TabBar activeKey="profile" />}
    </>
  );
}
