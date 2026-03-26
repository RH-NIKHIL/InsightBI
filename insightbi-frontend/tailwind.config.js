/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pagani: {
          black: '#060606',
          'black-secondary': '#0a0a0a',
          card: '#111111',
          'card-hover': '#181818',
          surface: '#141414',
          text: '#f0ece4',
          'text-secondary': '#a09888',
          'text-muted': '#605848',
          gold: '#c9a84c',
          'gold-light': '#e0c873',
          'gold-dark': '#9e8338',
          'border-subtle': 'rgba(201, 168, 76, 0.12)',
          'border-hover': 'rgba(201, 168, 76, 0.3)',
          'glass-bg': 'rgba(20, 20, 20, 0.6)',
          'glass-border': 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Montserrat', '"Helvetica Neue"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'hero-zoom': 'heroZoom 20s ease-in-out infinite alternate',
        'preloader-fill': 'preloaderFill 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'preloader-pulse': 'preloaderPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.6)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
        heroZoom: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1.2)' },
        },
        preloaderFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        preloaderPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        '20': '20px',
        '30': '30px',
        '40': '40px',
      },
      borderRadius: {
        'sm': '2px',
        'lg': '12px',
        'xl': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
