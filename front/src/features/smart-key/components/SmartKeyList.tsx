'use client';

import { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { KeyResponseDto } from '@/services/smartKey.types';
import { useLanguage } from '@/features/language';
import { messages } from '@/features/smart-key/locale';
import { SmartKeyDots, SmartKeyStatusModal, useSmartKey } from '@/features/smart-key';
import { SmartKeyCard } from '@/features/smart-key/components/smartkey-card/SmartKeyCard';

interface SmartKeyListProps {
  keys: KeyResponseDto[];
}

export function SmartKeyList({ keys }: SmartKeyListProps) {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { lang } = useLanguage();
  const t = messages[lang] ?? messages.kor;

  const { status, handleOpenDoor } = useSmartKey();

  const x = useMotionValue(0);
  const cardWidth = 350;
  const gap = 24;

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

    const targetX = -newIndex * (cardWidth + gap);
    x.stop();
    // TODO: animate to targetX if needed
  };

  return (
    <main className="flex flex-col w-full max-h-screen pt-10 pb-28">
      <h1 className="text-2xl font-semibold mt-2">{t.title}</h1>
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6 pt-8 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: -(keys.length - 1) * (cardWidth + gap),
            right: 0,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -activeIndex * (cardWidth + gap) }}
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
