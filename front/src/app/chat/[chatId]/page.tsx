import { ChatDetailPage } from '@/features/chat';

export default async function Page({ params }: { params: { chatId: string } }) {
  const { chatId } = await params;
  return <ChatDetailPage chatId={chatId} />;
}
