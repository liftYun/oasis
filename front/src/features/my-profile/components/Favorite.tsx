'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart } from 'lucide-react';

type FavoriteItem = {
  id: number;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  isLiked: boolean;
};

const sampleData: FavoriteItem[] = [
  {
    id: 1,
    name: '광안 바이브',
    price: 125000,
    rating: 4.6,
    imageUrl: '/images/sample-room.jpg',
    isLiked: true,
  },
  {
    id: 2,
    name: '광안 바이브',
    price: 125000,
    rating: 4.6,
    imageUrl: '/images/sample-room.jpg',
    isLiked: false,
  },
  {
    id: 3,
    name: '광안 바이브',
    price: 125000,
    rating: 4.5,
    imageUrl: '/images/sample-room.jpg',
    isLiked: false,
  },
  {
    id: 4,
    name: '광안 바이브',
    price: 125000,
    rating: 4.5,
    imageUrl: '/images/sample-room.jpg',
    isLiked: true,
  },
];

export function Favorite() {
  const [favorites, setFavorites] = useState(sampleData);

  const toggleLike = (id: number) => {
    setFavorites((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLiked: !item.isLiked } : item))
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* <BackHeader /> */}

      <div className="grid grid-cols-2 gap-4">
        {favorites.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl overflow-hidden shadow-sm border bg-white"
          >
            <div className="relative w-full h-28">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />

              <button
                onClick={() => toggleLike(item.id)}
                className="absolute top-2 right-2 p-1 bg-white/70 rounded-full"
              >
                <Heart
                  size={18}
                  className={item.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                />
              </button>

              <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs text-black px-2 py-0.5 rounded-full">
                ★ {item.rating}
              </div>
            </div>

            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.price.toLocaleString()} 원</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
