/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f0f0f5',
          100: '#d9d9e8',
          200: '#b3b3d0',
          300: '#8c8cb8',
          400: '#6666a0',
          500: '#404088',
          600: '#2d2d70',
          700: '#1f1f58',
          800: '#111140',
          900: '#080828',
          950: '#04041a',
        },
        glow: {
          DEFAULT: '#6c63ff',
          light: '#9b94ff',
          dark: '#4a42cc',
        },
        amber: {
          glow: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
