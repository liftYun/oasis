'use client';

import BackHeader from '@/components/molecules/BackHeader';
import StayInfoCard from '@/features/chat/components/StayInfoCard';
import MessageItem, { type MessageItemModel } from '@/features/chat/components/MessageItem';
import InputBar from '@/features/chat/components/InputBar';

interface ChatDetailPageProps {
  chatId: string;
}

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
  // 임시 더미 데이터 (UI 확인용)
  const stay = {
    id: 'stay-123',
    title: '광안 바이브',
    address: '부산 수영구 민락수변로 7 6층 601호',
  };

  const messages: MessageItemModel[] = [
    {
      id: 'm1',
      content:
        '안녕하세요, 숙소 예약 관련해서 문의드려요. 이번 주말 토요일부터 일요일까지 1박 2일로 생각 중인데 혹시 아직 예약 가능할까요?',
      isMine: true,
      timestamp: '25.09.02 오전 10:00',
    },
    {
      id: 'm2',
      content:
        '안녕하세요 🙂 네, 이번 주말은 아직 예약 가능합니다. 체크인은 오후 3시 이후, 체크아웃은 오전 11시까지예요.',
      isMine: false,
      timestamp: '25.09.02 오전 10:00',
    },
    {
      id: 'm3',
      content:
        '저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.',
      isMine: true,
      timestamp: '25.09.02 오전 10:00',
    },
    {
      id: 'm4',
      content:
        '저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.저희가 차량으로 이동하는데 주차 공간이 있을까요? 혹시 조식도 제공되는지 궁금합니다.ㄴ',
      isMine: true,
      timestamp: '25.09.02 오전 10:00',
    },
  ];

  const handleTranslate = (id: string) => {
    // UI만: 추후 번역 API 연결 예정
    console.log('translate message id:', id);
  };

  const handleSend = (text: string) => {
    // UI만: 추후 Firebase 연결 예정
    console.log('send message:', text, 'in chat:', chatId);
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <section className="px-4">
        <StayInfoCard stay={stay} />
      </section>

      <section className="flex-1 px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+88px)]">
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} onClickTranslate={handleTranslate} />
        ))}
      </section>

      <InputBar onSend={handleSend} />
    </main>
  );
}
