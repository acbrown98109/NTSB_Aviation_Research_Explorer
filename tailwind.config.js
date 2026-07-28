/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SAC/ICAO-inspired aviation blues
        aviation: {
          50:  '#f0f6fb',
          100: '#e1f0fa',  // active bg (#e1f0fa from ICAO)
          200: '#c3def4',
          300: '#8bbfe4',
          400: '#4a96cc',
          500: '#0063a6',  // logo blue (#0063a6)
          600: '#005491',
          700: '#003b75',  // dark blue (#003b75)
          800: '#002e5c',
          900: '#001f3e',
          950: '#001020',
        },
        // Keep these for data viz (severity, weather categories)
        danger:  { 500: '#dc2626', 600: '#b91c1c' },
        caution: { 500: '#d97706', 600: '#b45309' },
        safe:    { 500: '#059669', 600: '#047857' },
      },
      fontFamily: {
        sans: ['"Open Sans"', '"Segoe UI"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 2px 8px rgba(0,59,117,0.12)',
        input:  '0 0 0 1px #0063a6',
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-in-out',
        'slide-up':   'slideUp 0.2s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideIn: { '0%': { transform: 'translateX(-8px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
