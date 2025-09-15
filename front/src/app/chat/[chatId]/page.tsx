import { ChatDetailPage } from '@/features/chat';

export default async function Page({ params }: { params: { chatId: string } }) {
  // params를 비동기로 await 처리
  const { chatId } = await Promise.resolve(params);
  return <ChatDetailPage chatId={chatId} />;
}
