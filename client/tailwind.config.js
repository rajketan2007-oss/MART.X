/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        extrad: {
          pink: '#FF3F6C',
          orange: '#FF5722',
          dark: '#282C3F',
          muted: '#535766',
          light: '#F5F5F6',
          peach: '#FFF1F3',
          border: '#EAEAEC',
          neon: '#FF1493',
          violet: '#7928CA',
          cyan: '#00DFD8'
        }
      },
      fontFamily: {
        sans: ['Assistant', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card-hover': '0 20px 35px -10px rgba(255, 63, 108, 0.22), 0 10px 15px -5px rgba(0, 0, 0, 0.04)',
        'nav': '0 4px 20px 0 rgba(0, 0, 0, 0.06)',
        'neon-pink': '0 0 25px rgba(255, 63, 108, 0.5)',
        'neon-cyan': '0 0 25px rgba(0, 223, 216, 0.5)',
        '3d-float': '0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.08)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-reverse': 'float-reverse 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      }
    },
  },
  plugins: [],
}
