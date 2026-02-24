/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A1628', 50: '#EEF2F8', 700: '#0C1A33', 800: '#0D1F3C' },
        gold: { DEFAULT: '#D4AF37', light: '#E8D070', dark: '#B8961E', 600: '#B8961E' },
        cream: '#FAF8F4',

        'dark-grey': '#4B5563',
        'mid-grey': '#6B7280',
        'error': '#DC2626',
        'success': '#16A34A',
      },

      boxShadow: {
        'luxury-md': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'card': '0 8px 25px rgba(10, 22, 40, 0.08)',
        'card-hover': '0 15px 40px rgba(10, 22, 40, 0.15)',
        'popup': '0 25px 60px rgba(0, 0, 0, 0.2)',
        'gold': '0 10px 30px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 20px 50px rgba(212, 175, 55, 0.35)',
      },

      borderRadius: {
        'xl3': '1.5rem',
        'xl4': '2rem',
      },

      backgroundImage: {
        'gradient-gold':
          'linear-gradient(135deg, #D4AF37 0%, #EDCC55 50%, #B8961E 100%)',
      },

      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
      },

      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}