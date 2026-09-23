/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070C',
          900: '#0A0D15',
          800: '#11151F',
          700: '#1A1F2E',
          600: '#242B3D',
          500: '#333B52',
        },
        slate: {
          400: '#8B93A7',
          300: '#AEB4C4',
          100: '#E4E6EC',
        },
        amber: {
          500: '#F5A524',
          400: '#FBBF52',
        },
        neon: {
          cyan: '#2DE2E6',
          violet: '#A855F7',
          pink: '#F72585',
        },
        status: {
          backlog: '#94A3B8',
          todo: '#8B93A7',
          progress: '#2DE2E6',
          review: '#C084FC',
          blocked: '#F87171',
          done: '#4ADE80',
        },
        priority: {
          lowest: '#6B7280',
          low: '#60A5FA',
          medium: '#F5A524',
          high: '#FB923C',
          highest: '#F87171',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
      },
      boxShadow: {
        'glow-cyan': '0 0 0 1px rgba(45,226,230,0.4), 0 0 20px rgba(45,226,230,0.25)',
        'glow-violet': '0 0 0 1px rgba(168,85,247,0.4), 0 0 20px rgba(168,85,247,0.25)',
        'glow-amber': '0 0 0 1px rgba(245,165,36,0.45), 0 0 24px rgba(245,165,36,0.3)',
        'glow-sm': '0 0 12px rgba(45,226,230,0.18)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'gradient-brand': 'linear-gradient(135deg, #2DE2E6 0%, #A855F7 100%)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
