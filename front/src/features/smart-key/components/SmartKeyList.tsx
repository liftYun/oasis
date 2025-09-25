'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { KeyResponseDto } from '@/services/smartKey.types';
import { useLanguage } from '@/features/language';
import { messages } from '@/features/smart-key/locale';
import { SmartKeyDots, SmartKeyStatusModal, useSmartKey } from '@/features/smart-key';
import { SmartKeyCard } from './smartkey-card/SmartKeyCard';
import { SmartKeySummaryBar } from './smartkey-card/SmartKeySummaryBar';

interface SmartKeyListProps {
  keys: KeyResponseDto[];
}

export function SmartKeyList({ keys }: SmartKeyListProps) {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const { lang } = useLanguage();
  const t = messages[lang] ?? messages.kor;
  const { status, handleOpenDoor } = useSmartKey();

  const x = useMotionValue(0);
  const cardWidth = 350;
  const gap = 24;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const threshold = cardWidth * 0.2;

    let newIndex = activeIndex;
    if (offsetX < -threshold || velocityX < -500) {
      newIndex = Math.min(activeIndex + 1, keys.length - 1);
    } else if (offsetX > threshold || velocityX > 500) {
      newIndex = Math.max(activeIndex - 1, 0);
    }
    setActiveIndex(newIndex);
  };

  // 가운데 정렬 오프셋
  const centerOffset = (containerWidth - cardWidth) / 2;

  return (
    <main className="flex flex-col w-full max-w-[480px] mx-auto max-h-screen pt-10 pb-28">
      <h1 className="text-2xl font-semibold mt-2">{t.title}</h1>

      <SmartKeySummaryBar keys={keys} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <div className="overflow-visible" ref={containerRef}>
        <motion.div
          className="flex gap-6 pt-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: -(keys.length - 1) * (cardWidth + gap),
            right: 0,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -activeIndex * (cardWidth + gap) + centerOffset }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {keys.map((key, i) => (
            <motion.div
              key={key.keyId}
              animate={{
                scale: i === activeIndex ? 1 : 0.9,
                opacity: i === activeIndex ? 1 : 0.6,
              }}
              transition={{ duration: 0.3 }}
            >
              <SmartKeyCard
                keyData={key}
                isFlipped={openCard === key.keyId}
                setOpenCard={setOpenCard}
                handleOpenDoor={handleOpenDoor}
                lang={lang}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <SmartKeyDots keys={keys} activeIndex={activeIndex} />
      <SmartKeyStatusModal status={status} t={t} />
    </main>
  );
}

export default SmartKeyList;
