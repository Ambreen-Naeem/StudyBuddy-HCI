/** @type {import('tailwindcss').Config} */
// Tailwind configuration with the StudyBuddy design tokens.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand + semantic colors. Always pair color with an icon/text in the
        // UI so meaning is never conveyed by color alone (color-blind friendly).
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        success: { DEFAULT: '#16A34A', 50: '#F0FDF4', 100: '#DCFCE7' },
        warning: { DEFAULT: '#D97706', 50: '#FFFBEB', 100: '#FEF3C7' },
        error: { DEFAULT: '#DC2626', 50: '#FEF2F2', 100: '#FEE2E2' },

        // Theme-aware semantic surfaces backed by CSS variables (defined in
        // index.css for both light and `.dark`). Components written with these
        // classes follow the active theme automatically, so there is never a
        // white card "glowing" in dark mode.
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-muted': 'rgb(var(--content-muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        card: '0 4px 16px -4px rgb(15 23 42 / 0.10)',
        'card-lg': '0 10px 40px -12px rgb(15 23 42 / 0.25)',
        glow: '0 8px 24px -6px rgb(37 99 235 / 0.45)',
        'glow-secondary': '0 8px 24px -6px rgb(124 58 237 / 0.45)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
      },
    },
  },
  plugins: [],
}
