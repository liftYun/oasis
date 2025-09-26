import { ReactNode } from 'react';
import { StaticImageData } from 'next/image';

export type TabKey = 'home' | 'smart-key' | 'chat' | 'profile';

export type BaseTabItem = {
  key: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  badge?: number | string;
  ariaLabel?: string;
};

export type NavTabItem = {
  key: TabKey;
  label: string;
  activeIcon: StaticImageData;
  inactiveIcon: StaticImageData;
  path: string;
  badge: boolean;
};
