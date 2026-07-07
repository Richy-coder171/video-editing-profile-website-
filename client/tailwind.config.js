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
        acid: '#c5ff4a',
        frost: '#f6f7fb'
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 38px rgba(51, 214, 255, 0.18)',
        ember: '0 0 32px rgba(255, 54, 94, 0.2)'
      },
      backgroundImage: {
        'radial-grid':
          'radial-gradient(circle at top left, rgba(51,214,255,0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(255,54,94,0.16), transparent 32%)'
      }
    }
  },
  plugins: []
};
