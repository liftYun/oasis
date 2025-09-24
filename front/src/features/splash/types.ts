export type Lang = 'ko' | 'en';

export type Slide = {
  title: string;
  desc: string;
};

export interface OnboardSliderProps {
  slides: ReadonlyArray<{ title: string; desc: string }>;
  initialIndex?: number;
  loop?: boolean;
  autoPlayMs?: number;
  onChange?: (index: number, go: (i: number, dir: number) => void) => void;
  className?: string;
}
