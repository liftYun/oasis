export type Lang = 'ko' | 'en';

export type Slide = {
  title: string;
  desc: string;
};

export type OnboardSliderProps = {
  slides: readonly Slide[];
  initialIndex?: number;
  loop?: boolean;
  autoPlayMs?: number | null;
  onChange?: (index: number) => void;
  className?: string;
};
