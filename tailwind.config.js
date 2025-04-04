import scrollbarHide from 'tailwind-scrollbar-hide';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#48bb78',
        secondary: '#4a5568',
        background: '#282c34',
      },
      screens: {
        xl: '1280px',
        '2xl': '1920px',
      },
    },
  },
  plugins: [plugin(scrollbarHide)],
};
