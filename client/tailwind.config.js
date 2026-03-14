/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#080808',
        'dark-card': '#111111',
        'dark-border': '#1a1a1a',
        neon: '#39FF14',
        'neon-red': '#FF2D55',
        gold: '#FFD700',
        'off-white': '#F0F0F0',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(57, 255, 20, 0.5)',
        'neon-red': '0 0 15px rgba(255, 45, 85, 0.5)',
        gold: '0 0 15px rgba(255, 215, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
