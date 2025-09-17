import BackHeader from '@/components/molecules/BackHeader';

export default function ChatRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackHeader title="채팅" />
      <div className="pt-14 bg-white min-h-dvh overflow-y-auto">{children}</div>
    </>
  );
}
