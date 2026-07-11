/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07090b',
        graphite: '#0e1116',
        ember: '#ff4d57',
        electric: '#68a7ff',
        violet: '#8d7cff',
        hotpink: '#ff8bb5',
        acid: '#ffb000',
        frost: '#f2eee6'
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        glow: '0 0 38px rgba(104, 167, 255, 0.18)',
        ember: '0 0 32px rgba(255, 77, 87, 0.2)',
        violet: '0 0 42px rgba(141, 124, 255, 0.22)',
        panel: '0 28px 90px rgba(0, 0, 0, 0.42)'
      },
      backgroundImage: {
        'radial-grid':
          'radial-gradient(circle at top left, rgba(104,167,255,0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(255,77,87,0.13), transparent 32%)',
        'cinematic-sheen':
          'linear-gradient(110deg, rgba(104,167,255,0.16), transparent 32%, rgba(141,124,255,0.12) 58%, rgba(255,77,87,0.13))',
        'manga-lines':
          'linear-gradient(135deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 12px)'
      }
    }
  },
  plugins: []
};
