'use client';

import Image from 'next/image';
import { Star, Search } from 'lucide-react';
import { useState } from 'react';

type Review = {
  id: number;
  name: string;
  rating: number;
  imageUrl: string;
};

const sampleData: Review[] = [
  {
    id: 1,
    name: '광안 바이브',
    rating: 3.5,
    imageUrl: '/images/sample-room.jpg',
  },
  {
    id: 2,
    name: '광안 바이브',
    rating: 3.5,
    imageUrl: '/images/sample-room.jpg',
  },
  {
    id: 3,
    name: '광안 바이브',
    rating: 3.5,
    imageUrl: '/images/sample-room.jpg',
  },
  {
    id: 4,
    name: '광안 바이브',
    rating: 2.5,
    imageUrl: '/images/sample-room.jpg',
  },
];

export function Reviews() {
  const [reviews] = useState(sampleData);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="space-y-4">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl shadow-sm bg-gray-50 p-3"
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex flex-col flex-1">
              <h2 className="text-gray-800 font-medium">{item.name}</h2>

              <div className="flex items-center mt-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(item.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
              </div>

              <button className="flex items-center gap-1 text-xs text-gray-500 hover:underline">
                <Search size={14} />
                <span>자세히 보기</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
