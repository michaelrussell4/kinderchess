/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['"Fredoka"', 'sans-serif'],
        friendly: ['"Quicksand"', 'sans-serif'],
      },
      animation: {
        'bounce-short': 'bounce 0.6s ease-in-out 2',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.75))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.35))' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

