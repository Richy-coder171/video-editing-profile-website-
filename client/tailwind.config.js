/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        graphite: '#101114',
        ember: '#ff365e',
        electric: '#33d6ff',
        violet: '#9b5cff',
        hotpink: '#ff4fd8',
        acid: '#c5ff4a',
        frost: '#f6f7fb'
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 38px rgba(51, 214, 255, 0.18)',
        ember: '0 0 32px rgba(255, 54, 94, 0.2)',
        violet: '0 0 42px rgba(155, 92, 255, 0.22)',
        panel: '0 28px 90px rgba(0, 0, 0, 0.42)'
      },
      backgroundImage: {
        'radial-grid':
          'radial-gradient(circle at top left, rgba(51,214,255,0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(255,54,94,0.16), transparent 32%)',
        'cinematic-sheen':
          'linear-gradient(110deg, rgba(51,214,255,0.16), transparent 32%, rgba(155,92,255,0.13) 58%, rgba(255,54,94,0.14))',
        'manga-lines':
          'linear-gradient(135deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 12px)'
      }
    }
  },
  plugins: []
};
