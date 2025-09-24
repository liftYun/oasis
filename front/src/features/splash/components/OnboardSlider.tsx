'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardSliderProps } from '@/features/splash';
import BlockChainImage from '@/assets/images/blockchain.png';
import KeyImage from '@/assets/images/key.png';
import StayImage from '@/assets/images/stay.png';

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    filter: 'blur(4px)',
  }),
};

export function OnboardSlider({
  slides,
  initialIndex = 0,
  loop = false,
  autoPlayMs,
  onChange,
  className = '',
}: OnboardSliderProps) {
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
      onChange?.(clamped, go);
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
        <Image src={BlockChainImage} alt="Blockchain" fill className="object-contain" priority />
      </div>,
      <div className="w-48 h-48 relative" key="b1">
        <Image src={KeyImage} alt="Key" fill className="object-contain" loading="eager" />
      </div>,
      <div className="w-48 h-48 relative" key="b2">
        <Image src={StayImage} alt="Stay" fill className="object-contain" loading="eager" />
      </div>,
    ],
    []
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Onboarding"
      className={`relative mt-14 w-full select-none ${className}`}
    >
      <button
        aria-label="Previous slide"
        onClick={prev}
        disabled={!loop && index === 0}
        className="absolute left-0 top-0 h-full w-1/5 z-10"
      />
      <button
        aria-label="Next slide"
        onClick={next}
        disabled={!loop && index === max}
        className="absolute right-0 top-0 h-full w-1/5 z-10"
      />

      <div className="relative h-[clamp(300px,60vh,420px)] overflow-hidden flex items-center justify-center">
        <AnimatePresence custom={direction} mode="sync" initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragMomentum={false}
            dragElastic={0.14}
            onDragEnd={(_, { offset, velocity }) => {
              const power = Math.abs(offset.x) * Math.abs(velocity.x);
              const powerThreshold = 220;
              const distanceThreshold = 120;
              if (power > powerThreshold || Math.abs(offset.x) > distanceThreshold) {
                offset.x < 0 ? next() : prev();
              }
            }}
            className="absolute inset-0 px-6 flex flex-col justify-center items-center text-center"
          >
            <div className="max-w-md">
              <h2 className="text-2xl font-bold">{slide.title}</h2>
              <p className="mt-2 text-gray-600 whitespace-pre-line">{slide.desc}</p>
            </div>

            <div className="mt-6 h-[clamp(200px,40vh,320px)] flex items-center justify-center">
              {defaultBodies[index]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
