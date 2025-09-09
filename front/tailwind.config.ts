import type { Config } from 'tailwindcss';
import { colors, fonts, borderRadius, boxShadow } from './styles';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: { colors, fontFamily: fonts, borderRadius, boxShadow },
  },
  plugins: [],
};
export default config;
