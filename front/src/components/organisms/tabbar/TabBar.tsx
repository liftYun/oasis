'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TabKey, NavTabItem } from '@/components/organisms/types';
import HomeDisable from '@/assets/icons/home-disable.png';
import HomeEnable from '@/assets/icons/home-enable.png';
import KeyDisable from '@/assets/icons/key-disable.png';
import KeyEnable from '@/assets/icons/key-enable.png';
import ChatDisable from '@/assets/icons/chat-disable.png';
import ChatEnable from '@/assets/icons/chat-enable.png';
import UserDisable from '@/assets/icons/user-disable.png';
import UserEnable from '@/assets/icons/user-enable.png';
import { useLanguage } from '@/features/language/';
import { tabBarMessages } from '@/components/organisms/tabbar/locale';

type TabBarProps = {
  activeKey: TabKey;
  withSafeArea?: boolean;
};

export default function TabBar({ activeKey, withSafeArea = true }: TabBarProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = tabBarMessages[lang];

  const items: NavTabItem[] = [
    {
      key: 'home',
      label: t.home,
      activeIcon: HomeEnable,
      inactiveIcon: HomeDisable,
      path: '/main',
    },
    {
      key: 'smart-key',
      label: t.smartKey,
      activeIcon: KeyEnable,
      inactiveIcon: KeyDisable,
      path: '/smart-key',
    },
    {
      key: 'chat',
      label: t.chat,
      activeIcon: ChatEnable,
      inactiveIcon: ChatDisable,
      path: '/chat',
    },
    {
      key: 'profile',
      label: t.profile,
      activeIcon: UserEnable,
      inactiveIcon: UserDisable,
      path: '/my-profile',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[478px] border-t border-gray-200 bg-gray-100 z-40"
      style={
        {
          '--safe-bottom': withSafeArea ? 'calc(env(safe-area-inset-bottom, 0px) + 20px)' : '8px',
        } as React.CSSProperties
      }
    >
      <div className="grid grid-cols-4 gap-2 px-4 pt-4 pb-[var(--safe-bottom)]">
        {items.map((it) => {
          const active = it.key === activeKey;
          return (
            <button
              key={it.key}
              onClick={() => router.push(it.path as any)}
              className="relative flex flex-col items-center justify-center gap-2 py-1 text-xs"
            >
              <Image
                src={active ? it.activeIcon : it.inactiveIcon}
                alt={it.label}
                width={24}
                height={24}
              />
              <span className={active ? 'text-gray-600' : 'text-gray-300'}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
