/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space / Future Tech Palette
        background: '#030014', // Very dark blue/purple
        surface: '#0f0729',    // Slightly lighter for cards
        surfaceHighlight: '#1a1040',
        primary: {
          DEFAULT: '#7045ff',  // Electric Violet
          glow: '#b084ff',
          dark: '#4c1d95',
        },
        secondary: {
          DEFAULT: '#00d4ff',  // Cyan/Neon Blue
          glow: '#7dd3fc',
        },
        accent: {
          DEFAULT: '#ff0055',  // Neon Pink for alerts/active states
          glow: '#ff4d88',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.1)',
          surface: 'rgba(255, 255, 255, 0.03)',
          highlight: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #7045ff, 0 0 10px #7045ff' },
          '100%': { boxShadow: '0 0 20px #7045ff, 0 0 30px #00d4ff' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
      }
    },
  },
  plugins: [],
}
