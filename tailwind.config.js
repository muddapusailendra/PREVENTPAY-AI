/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: "#0B0F17",
          card: "#131B2E",
          cardHover: "#1A253D",
          border: "#23304D",
          emerald: "#10B981",
          emeraldGlow: "rgba(16, 185, 129, 0.15)",
          amber: "#F59E0B",
          red: "#EF4444",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          textMuted: "#94A3B8",
          textHead: "#F8FAFC",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
