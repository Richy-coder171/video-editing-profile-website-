import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }

          if (id.includes('gsap') || id.includes('framer-motion') || id.includes('lenis')) {
            return 'motion-vendor';
          }

          if (id.includes('lucide-react')) {
            return 'icons';
          }

          if (id.includes('three')) {
            return 'three-vendor';
          }

          return 'vendor';
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
