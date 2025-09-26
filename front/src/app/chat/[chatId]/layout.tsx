'use client';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';

export default function ChatRoomLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  return (
    <>
      <BackHeader title={t.titleChat} />
      <div className="pt-20 bg-blue-50 min-h-dvh overflow-y-auto">{children}</div>
    </>
  );
}
