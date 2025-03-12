/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#48bb78',
        secondary: '#4a5568',
        background: '#282c34',
      },
    },
  },
  plugins: [],
};
