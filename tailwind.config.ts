import type { Config } from 'tailwindcss';

/**
 * PawScales design tokens (design.md v2). Colors map to CSS variables in
 * app/globals.css. Tailwind's default palette is replaced (not extended) so
 * default classes like bg-purple-* / text-slate-* cannot be used anywhere.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: '#FFFFFF',
      black: '#000000',
      bg: 'var(--bg)',
      ink: 'var(--ink)',
      muted: 'var(--muted)',
      line: 'var(--line)',
      field: 'var(--field)',
      sand: 'var(--sand)',
      brand: 'var(--brand)',
      'brand-hover': 'var(--brand-hover)',
      sage: 'var(--sage)',
      sky: 'var(--sky)',
      butter: 'var(--butter)',
      lime: 'var(--lime)',
      accent: 'var(--accent)',
      danger: 'var(--danger)',
    },
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: 'var(--line)',
    }),
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '12px',
      md: '12px',
      lg: '16px',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      card: '0 1px 2px rgba(17,19,18,.05), 0 8px 24px rgba(17,19,18,.06)',
    },
    extend: {
      maxWidth: {
        container: '1200px',
        reading: '720px',
        toc: '260px',
      },
      screens: { sm: '640px', md: '960px', lg: '1200px' },
    },
  },
  plugins: [],
};

export default config;
