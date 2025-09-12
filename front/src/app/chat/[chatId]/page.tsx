type PageProps = {
  params: { chatId: string };
};

export default function Page({ params }: PageProps) {
  return (
    <div className="px-6 py-10">
      <h1 className="text-xl font-semibold text-gray-600">Chat Room</h1>
      <p className="mt-2 text-sm text-gray-300"> 더미 방입니다. chatId: {params.chatId}</p>
    </div>
  );
}
