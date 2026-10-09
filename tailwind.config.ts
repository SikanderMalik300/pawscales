import type { Config } from 'tailwindcss';

/**
 * PawScales design tokens (design.md sections 3-5).
 * Colors map to CSS variables defined in app/globals.css so a dark theme can be
 * added later. Tailwind's default palette is intentionally disabled below so
 * `bg-purple-*`, `text-slate-*`, etc. cannot be used anywhere.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // Replace (not extend) the palette: only our tokens exist as color classes.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: '#FFFFFF',
      black: '#000000',
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      'surface-2': 'var(--surface-2)',
      ink: 'var(--ink)',
      text: 'var(--text)',
      muted: 'var(--muted)',
      border: 'var(--border)',
      'border-strong': 'var(--border-strong)',
      brand: 'var(--brand)',
      'brand-hover': 'var(--brand-hover)',
      'brand-tint': 'var(--brand-tint)',
      accent: 'var(--accent)',
      'accent-ink': 'var(--accent-ink)',
      danger: 'var(--danger)',
      focus: 'var(--focus)',
    },
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: 'var(--border)',
    }),
    fontFamily: {
      heading: ['var(--font-heading)', 'Georgia', 'serif'],
      body: ['var(--font-body)', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      none: '0',
      sm: '6px',
      DEFAULT: '6px',
      md: '6px',
      lg: '10px',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      card: '0 1px 2px rgba(20,30,25,.06), 0 2px 8px rgba(20,30,25,.05)',
    },
    extend: {
      fontSize: {
        // role -> [size, line-height] (design.md section 4)
        h1: ['36px', { lineHeight: '1.15' }],
        'h1-m': ['28px', { lineHeight: '1.15' }],
        h2: ['26px', { lineHeight: '1.25' }],
        'h2-m': ['22px', { lineHeight: '1.25' }],
        h3: ['18px', { lineHeight: '1.35' }],
        'h3-m': ['17px', { lineHeight: '1.35' }],
        body: ['16px', { lineHeight: '1.6' }],
        lead: ['17px', { lineHeight: '1.55' }],
        label: ['14px', { lineHeight: '1.4' }],
        small: ['13px', { lineHeight: '1.45' }],
        overline: ['12px', { lineHeight: '1.3', letterSpacing: '0.06em' }],
        result: ['40px', { lineHeight: '1.1' }],
        'result-m': ['34px', { lineHeight: '1.1' }],
        'result-2': ['22px', { lineHeight: '1.2' }],
        'result-2-m': ['20px', { lineHeight: '1.2' }],
      },
      spacing: {
        // 4px grid (design.md 5): 4,8,12,16,20,24,32,40,48,64 via defaults + these
        '15': '60px',
      },
      maxWidth: {
        container: '1120px',
        reading: '720px',
        prose: '68ch',
        toc: '260px',
      },
      screens: {
        sm: '640px',
        md: '960px',
        lg: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
