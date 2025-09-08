const { colors, fonts, borderRadius, boxShadow } = require('./styles');

module.exports = {
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
