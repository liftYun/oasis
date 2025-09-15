import { ChatDetailPage } from '@/features/chat';

export default function Page({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  return <ChatDetailPage chatId={chatId} />;
}
