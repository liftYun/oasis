'use client';

import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import type { AnimationConfig, AnimationItem } from 'lottie-web';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lottie from 'lottie-web/build/player/lottie_light.min.js';

interface LottieProps
  extends HTMLAttributes<HTMLDivElement>,
    Omit<AnimationConfig, 'container' | 'renderer' | 'path'> {
  src: string;
}

export const Lottie = ({ src, loop = true, autoplay = true, ...props }: LottieProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem>();

  useEffect(() => {
    if (!containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      path: src,
      loop,
      autoplay,
      renderer: 'svg',
      rendererSettings: {
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    });

    return () => {
      animationRef.current?.destroy();
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} {...props} />;
};
