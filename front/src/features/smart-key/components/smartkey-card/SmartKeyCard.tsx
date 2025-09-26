'use client';

import { motion } from 'framer-motion';
import type { KeyResponseDto } from '@/services/smartKey.types';
import { SmartKeyCardFront } from './SmartKeyCardFront';
import { SmartKeyCardBack } from './SmartKeyCardBack';

interface SmartKeyCardProps {
  keyData: KeyResponseDto;
  isFlipped: boolean;
  setOpenCard: (id: number | null) => void;
  handleOpenDoor: (keyId: number) => void;
  lang: 'kor' | 'eng';
}

export function SmartKeyCard({
  keyData,
  isFlipped,
  setOpenCard,
  handleOpenDoor,
  lang,
}: SmartKeyCardProps) {
  return (
    <motion.div className="relative flex-shrink-0 w-[350px] h-[430px]">
      <motion.div
        onClick={() => setOpenCard(isFlipped ? null : keyData.keyId)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full rounded-xl [transform-style:preserve-3d]"
      >
        <SmartKeyCardFront keyData={keyData} handleOpenDoor={handleOpenDoor} lang={lang} />
        <SmartKeyCardBack keyData={keyData} lang={lang} />
      </motion.div>
    </motion.div>
  );
}
