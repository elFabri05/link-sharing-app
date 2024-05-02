import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    // Configure dev server settings (useful for local development)
    port: 3000, // The default port for the Vite server, change if needed
    strictPort: true, // If the port is occupied, Vite will exit instead of trying another port
    proxy: {
      // Proxy API request to the backend during development
      '/api': {
        target: 'http://localhost:5000', // Adjust if your Express server runs on a different port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Adjust if your API path differs
      }
    }
  },
})
