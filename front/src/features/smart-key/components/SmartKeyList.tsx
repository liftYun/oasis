'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const cards = [
  {
    id: 1,
    name: '광안 바이브',
    address: '부산 수영구 민락수변로 7 6층 601호',
    color: 'from-[#A9C9FF] to-[#FFE6F7]',
  },
  {
    id: 2,
    name: '사무실 키',
    address: '서울 강남구 테헤란로 123',
    color: 'from-[#B5EAD7] to-[#FFF5BA]',
  },
  {
    id: 3,
    name: '별장 키',
    address: '강원 양양군 해변로 22',
    color: 'from-[#FFF5BA] to-[#CDEAFF]',
  },
  {
    id: 4,
    name: '리조트 키',
    address: '제주 서귀포시 해안로 55',
    color: 'from-[#FFF5BA] to-[#C6F6D5]',
  },
  {
    id: 5,
    name: '휴양 키',
    address: '전남 여수시 오션로 77',
    color: 'from-[#E0BBE4] to-[#FFDFD3]',
  },
];

export function SmartKeyList() {
  const [windowWidth, setWindowWidth] = useState(0);
  const x = useMotionValue(0);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = 350;
  const gap = 24;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      const center = window.innerWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((_, i) => {
        const cardCenter = i * (cardWidth + gap) + cardWidth / 2 + latest;
        const distance = Math.abs(center - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    });

    return () => unsubscribe();
  }, [x]);

  return (
    <main className="flex flex-col w-full px-0 py-10 min-h-screen bg-white">
      <h2 className="text-2xl font-semibold text-left px-6 mb-4">스마트 키</h2>

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6 p-5 pt-8 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -1500, right: 0 }}
          style={{ x }}
        >
          {cards.map((card, i) => {
            const scale = useTransform(x, (latest) => {
              if (windowWidth === 0) return 1;
              const center = windowWidth / 2;
              const cardCenter = i * (cardWidth + gap) + cardWidth / 2 + latest;
              const distance = Math.abs(center - cardCenter);
              const maxDistance = cardWidth;
              const progress = Math.min(distance / maxDistance, 1);
              return 1 - progress * 0.15;
            });

            const isFlipped = openCard === card.id;
            const isActive = i === activeIndex;

            return (
              <motion.div
                key={card.id}
                style={{ scale }}
                className="relative flex-shrink-0 w-[350px] h-[430px] [perspective:1000px]"
              >
                {openCard === null && isActive && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: [0, -3, 0] }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{
                        duration: 0.2,
                        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="absolute -top-8 right-0 z-10"
                    >
                      <div className="relative w-max rounded-sm bg-black/70 text-white text-xs font-light px-3 py-1 shadow">
                        스마트 키를 눌러 상세 정보를 확인해보세요!
                        <div
                          className="absolute -bottom-1 right-4 
                     w-0 h-0
                     border-l-4 border-r-4 border-t-4
                     border-l-transparent border-r-transparent border-t-black/70"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                <motion.div
                  onClick={() => setOpenCard(isFlipped ? null : card.id)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full rounded-2xl shadow-lg [transform-style:preserve-3d]"
                >
                  <div
                    className={`absolute inset-0 card-face p-8 rounded-2xl shadow-lg bg-gradient-to-br ${card.color} text-gray-800 flex flex-col justify-between`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'translateZ(1px)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{card.name}</h3>
                        <p className="text-sm text-gray-600">{card.address}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full
                          bg-white/30 backdrop-blur-sm
                          border border-white/40
                          text-gray-800 text-xs shadow-sm"
                      >
                        활성
                      </span>
                    </div>

                    <button
                      onClick={() => console.log('문 열기 클릭')}
                      className="w-32 h-32 mx-auto rounded-full
                        bg-white/30 backdrop-blur-sm border border-white/40
                        text-gray-800 text-lg font-semibold
                        flex items-center justify-center shadow-inner
                        hover:bg-white/50 hover:scale-105 transition"
                    >
                      문 열기
                    </button>

                    <p className="text-center text-xs text-gray-700 mt-4">
                      이 키는 호스트가 발급한 스마트 키입니다.
                      <br />문 열기 버튼을 눌러 출입하세요.
                    </p>
                  </div>

                  <div
                    className={`absolute inset-0 card-face rounded-2xl shadow-md bg-gradient-to-br ${card.color} p-4 flex flex-col`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg) translateZ(1px)',
                    }}
                  >
                    <div className="flex flex-col flex-1">
                      <div className="flex gap-4 items-start bg-white rounded-lg p-4">
                        <img
                          src="https://via.placeholder.com/60"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{card.name}</h3>
                          <p className="text-sm text-gray-600">{card.address}</p>
                          <button className="text-xs text-blue-600 underline mt-1">
                            자세히 보기
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4 text-sm bg-white rounded-lg p-6">
                        <div className="text-left flex-1">
                          <p className="text-gray-500 mb-1">활성화 시간</p>
                          <p className="font-medium">
                            25.09.01 (월)
                            <br />
                            오후 3:00
                          </p>
                        </div>
                        <div className="w-px bg-gray-200"></div>
                        <div className="text-right flex-1">
                          <p className="text-gray-500 mb-1">만료 시간</p>
                          <p className="font-medium">
                            25.09.08 (월)
                            <br />
                            오전 11:00
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 bg-white rounded-lg p-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200" />
                        <div>
                          <p className="text-xs text-white rounded-full px-2 py-0.5 bg-gray-500 mb-1">
                            호스트
                          </p>
                          <p className="text-sm font-medium text-gray-600 text-center">이민희</p>
                        </div>
                      </div>

                      <button
                        className="mt-4 w-full py-3 rounded-md
             bg-white/30 backdrop-blur-sm
             border border-white/40
             text-gray-800 text-sm font-medium
             shadow-sm hover:bg-white/40 transition"
                      >
                        채팅 시작하기
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {cards.map((c, i) => (
          <div
            key={c.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-5 bg-gray-800' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </main>
  );
}
