/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f7f7',
          100: '#ededed',
          200: '#d6d6d6',
          300: '#b0b0b0',
          400: '#8a8a8a',
          500: '#6b6b6b',
          600: '#525252',
          700: '#3d3d3d',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#ff3b00',
          50: '#fff4f0',
          100: '#ffe5dc',
          200: '#ffc7b3',
          300: '#ff9f80',
          400: '#ff6a3d',
          500: '#ff3b00',
          600: '#ed2e00',
          700: '#c42600',
          800: '#9c2200',
          900: '#7e1f00',
        },
        electric: {
          DEFAULT: '#0066ff',
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd7ff',
          300: '#8ebcff',
          400: '#5a97ff',
          500: '#0066ff',
          600: '#004dcc',
          700: '#003d99',
          800: '#002e6b',
          900: '#001f47',
        },
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9' }],
        '11xl': ['13rem', { lineHeight: '0.85' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '104rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
