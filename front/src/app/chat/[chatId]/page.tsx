import { ChatDetailPage } from '@/features/chat';

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  return <ChatDetailPage chatId={chatId} />;
}
