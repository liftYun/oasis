export type Slide = {
  title: string;
  desc: string;
};

export type OnboardSliderProps = {
  slides: Slide[];
  initialIndex?: number;
  loop?: boolean;
  autoPlayMs?: number | null;
  onChange?: (index: number) => void;
  className?: string;
};
