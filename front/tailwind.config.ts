import type { Config } from 'tailwindcss';
import { colors, fonts, borderRadius, boxShadow } from './styles';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: fonts,
      borderRadius,
      boxShadow,
      keyframes: {
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        'bounce-x': 'bounce-x 1s infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};

export default config;
