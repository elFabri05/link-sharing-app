import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';


export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');

    return defineConfig({
        plugins: [react(), tsconfigPaths()],
        server: {
            port: parseInt(env.VITE_PORT) || 3302, 
            strictPort: true, 
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        },
    });
}