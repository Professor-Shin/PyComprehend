/** @type {import('tailwindcss').Config} */

/** Every colour resolves to a CSS variable defined in src/index.css, so light and
 *  dark are one palette swap rather than 519 conditional class names. */
const token = (name) => ({
  DEFAULT: `rgb(var(--${name}) / <alpha-value>)`,
});
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Sarabun', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        /* surfaces */
        canvas: v('canvas'),
        surface: v('surface'),
        sunken: v('sunken'),
        code: v('code'),
        /* borders */
        subtle: v('border-subtle'),
        strong: v('border-strong'),
        /* text */
        primary: v('text-primary'),
        muted: v('text-muted'),
        faint: v('text-faint'),
        /* semantic accents — each has a foreground, a tint fill and a line */
        accent: { DEFAULT: v('accent'), tint: v('accent-tint'), line: v('accent-line') },
        ok: { DEFAULT: v('ok'), tint: v('ok-tint'), line: v('ok-line') },
        err: { DEFAULT: v('err'), tint: v('err-tint'), line: v('err-line') },
        fill: { DEFAULT: v('fill'), tint: v('fill-tint'), line: v('fill-line') },
        /* syntax highlighting */
        syn: {
          kw: v('syn-kw'),
          str: v('syn-str'),
          num: v('syn-num'),
          fn: v('syn-fn'),
          com: v('syn-com'),
          op: v('syn-op'),
        },
      },
      borderRadius: { xl: '0.625rem', '2xl': '0.75rem' },
    },
  },
  plugins: [],
};
