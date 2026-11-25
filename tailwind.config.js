/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Open Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        veyra: {
          bg: '#F6F7FC',
          surface: '#FFFFFF',
          tint: '#EEF0FA',
          ink: '#1E293B',
          muted: '#64748B',
          border: '#E5E7F0',
          blue: '#1D4ED8',
          blueDark: '#1E40AF',
          lavender: '#8B7AE8',
          lavenderSoft: '#ECE9FE',
          lavenderMid: '#D8DDF8',
        },
      },
    },
  },
  plugins: [],
};
