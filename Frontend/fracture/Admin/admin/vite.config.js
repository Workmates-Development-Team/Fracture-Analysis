import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure proper module resolution
      '@react-pdf/renderer': '@react-pdf/renderer/dist/umd/react-pdf-renderer.min.js'
    }
  },
});