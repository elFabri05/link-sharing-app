import { defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT, 10) || 3000,  // Use VITE_PORT from .env, fallback to 3000
      strictPort: true,  // If the port is already in use, it will not increment to another
    },
  };
});