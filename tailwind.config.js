/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal:      '#0CC5B9',
        'teal-bg': '#4CBB9B',
        'teal-light': '#E9FAF8',
        'teal-dark': '#0AA99E',
        navy:      '#25303D',
        slate:     '#3D4B5A',
        mint:      '#9FE5D5',
        'app-bg':  '#F4F7F6',
        'field-bg':'#E8EEED',
        'dark-bg': '#0F1923',
        muted:     '#7E8A93',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans:  ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        xl2: '20px',
      },
      maxWidth: {
        app: '480px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(12,197,185,0.10)',
        nav:  '0 -2px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
