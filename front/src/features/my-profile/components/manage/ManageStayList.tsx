'use client';

import Image from 'next/image';
import Link from 'next/link';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';

const stays = [
  {
    id: 1,
    name: '광안 바이버',
    location: '부산 수영구 민락동 7길 60 101호',
    image: '/images/stay1.jpg',
  },
  {
    id: 2,
    name: '해운대 스테이',
    location: '부산 해운대구 해변로 32',
    image: '/images/stay2.jpg',
  },
  // ...
];

export function ManageStayList() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <BackHeader title={t.manageStay} />
      <div className="mt-10 grid grid-cols-2 place-items-center gap-6">
        {stays.map((stay) => (
          <Link
            key={stay.id}
            href={`/my-profile/manage-stay/${stay.id}`}
            className="group relative w-[200px] rounded-xl overflow-hidden shadow hover:shadow-md transition"
          >
            <div className="relative aspect-square">
              <Image
                src={stay.image}
                alt={stay.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-base font-medium opacity-90 transition duration-300 group-hover:opacity-100 group-hover:scale-110">
                  {stay.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
