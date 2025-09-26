'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TabKey } from '@/components/organisms/types';
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
import { useChatStore } from '@/stores/useChatStore';

type TabBarProps = {
  activeKey: TabKey;
  withSafeArea?: boolean;
};

export default function TabBar({ activeKey, withSafeArea = true }: TabBarProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = tabBarMessages[lang];

  const unreadTotal = useChatStore((s) =>
    Object.values(s.unreadMap).reduce((sum, c) => sum + c, 0)
  );

  const safeBottom = withSafeArea ? 'calc(env(safe-area-inset-bottom, 0px) + 12px)' : '8px';

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[478px] border-t border-gray-200 bg-gray-100 z-40"
      style={{ '--safe-bottom': safeBottom } as React.CSSProperties}
    >
      <div className="grid grid-cols-4 gap-2 px-4 pt-4 pb-[var(--safe-bottom)]">
        <button
          onClick={() => router.push('/main')}
          className="relative flex flex-col items-center justify-center gap-2 py-1 text-xs"
        >
          <Image
            src={activeKey === 'home' ? HomeEnable : HomeDisable}
            alt={t.home}
            width={24}
            height={24}
          />
          <span className={activeKey === 'home' ? 'text-gray-600' : 'text-gray-300'}>{t.home}</span>
        </button>

        <button
          onClick={() => router.push('/smart-key')}
          className="relative flex flex-col items-center justify-center gap-2 py-1 text-xs"
        >
          <Image
            src={activeKey === 'smart-key' ? KeyEnable : KeyDisable}
            alt={t.smartKey}
            width={24}
            height={24}
          />
          <span className={activeKey === 'smart-key' ? 'text-gray-600' : 'text-gray-300'}>
            {t.smartKey}
          </span>
        </button>

        <button
          onClick={() => router.push('/chat')}
          className="relative flex flex-col items-center justify-center gap-2 py-1 text-xs"
        >
          <div className="relative">
            <Image
              src={activeKey === 'chat' ? ChatEnable : ChatDisable}
              alt={t.chat}
              width={24}
              height={24}
            />
            {unreadTotal > 0 && (
              <span
                className="absolute -top-1 -right-4 flex h-5 min-w-[1.25rem] items-center justify-center
                           rounded-full bg-gradient-to-r from-primary to-green text-white
                           text-[11px] font-medium px-1"
              >
                {unreadTotal > 9 ? '9+' : unreadTotal}
              </span>
            )}
          </div>
          <span className={activeKey === 'chat' ? 'text-gray-600' : 'text-gray-300'}>{t.chat}</span>
        </button>

        <button
          onClick={() => router.push('/my-profile')}
          className="relative flex flex-col items-center justify-center gap-2 py-1 text-xs"
        >
          <Image
            src={activeKey === 'profile' ? UserEnable : UserDisable}
            alt={t.profile}
            width={24}
            height={24}
          />
          <span className={activeKey === 'profile' ? 'text-gray-600' : 'text-gray-300'}>
            {t.profile}
          </span>
        </button>
      </div>
    </nav>
  );
}
