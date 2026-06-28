import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      colors: {
        brand: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
        },
        semantic: {
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        },
        bg: {
          0: '#07070e',
          1: '#0d0d19',
          2: '#12121e',
          3: '#181828',
          4: '#1e1e32',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        ticker: 'ticker 40s linear infinite',
        'fade-in': 'fadeIn .2s ease',
        'slide-up': 'slideUp .3s cubic-bezier(.34,1.56,.64,1)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
