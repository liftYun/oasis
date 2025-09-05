'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlockChainImage from '@/assets/images/blockchain.png';
import KeyImage from '@/assets/images/key.png';
import StayImage from '@/assets/images/stay.png';

export type Slide = {
  title: string;
  desc: string;
  body?: React.ReactNode;
};

type Props = {
  slides: Slide[];
  initialIndex?: number;
  loop?: boolean;
  autoPlayMs?: number | null;
  onChange?: (index: number) => void;
  className?: string;
};

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 140 : -140, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -140 : 140, opacity: 0 }),
};

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * Math.abs(velocity);

export default function OnboardSlider({
  slides,
  initialIndex = 0,
  loop = false,
  autoPlayMs,
  onChange,
  className = '',
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<number | null>(null);
  const max = slides.length - 1;

  const clampIndex = useCallback(
    (i: number) => (loop ? (i + slides.length) % slides.length : Math.min(Math.max(i, 0), max)),
    [loop, slides.length, max]
  );

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      const clamped = clampIndex(next);
      setIndex(clamped);
      onChange?.(clamped);
    },
    [clampIndex, onChange]
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  useEffect(() => {
    if (!autoPlayMs) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => next(), autoPlayMs) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, autoPlayMs, next]);

  const slide = useMemo(() => slides[index], [slides, index]);

  const defaultBodies = useMemo(
    () => [
      <div className="w-48 h-48 relative" key="b0">
        <Image src={BlockChainImage} alt="Blockchain" fill className="object-contain" />
      </div>,
      <div className="w-48 h-48 relative" key="b1">
        <Image src={KeyImage} alt="Key" fill className="object-contain" />
      </div>,
      <div className="w-48 h-48 relative" key="b2">
        <Image src={StayImage} alt="Stay" fill className="object-contain" />
      </div>,
    ],
    []
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Onboarding"
      className={`relative w-full select-none ${className}`}
    >
      <button
        aria-label="Previous slide"
        onClick={prev}
        disabled={!loop && index === 0}
        className="absolute left-0 top-0 h-full w-1/5 z-10 opacity-0"
      />
      <button
        aria-label="Next slide"
        onClick={next}
        disabled={!loop && index === max}
        className="absolute right-0 top-0 h-full w-1/5 z-10 opacity-0"
      />

      <div className="relative overflow-hidden h-[460px] mt-10">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 420, damping: 42 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, { offset, velocity }) => {
              const power = swipePower(offset.x, velocity.x);
              const threshold = 200;
              if (power > threshold) offset.x < 0 ? next() : prev();
            }}
            className="absolute inset-0 px-6 transform-gpu"
          >
            <div className="mt-10 min-h-[120px] flex flex-col justify-start">
              <h2 className="text-2xl font-bold text-center">{slide.title}</h2>
              <p className="mt-2 text-gray-600 whitespace-pre-line text-center">{slide.desc}</p>
            </div>

            <div className="mt-6 h-64 flex items-center justify-center">{defaultBodies[index]}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 mb-10 flex justify-center gap-2" aria-label="Slide indicators">
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-2 rounded-full transition
                ${active ? 'bg-gray-600 w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'}
              `}
            />
          );
        })}
      </div>
    </section>
  );
}
