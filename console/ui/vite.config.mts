import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import {resolve} from 'path';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  optimizeDeps: {
    exclude: ['js-big-decimal'],
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@assets': resolve(__dirname, './src/shared/assets'),
      '@entities': resolve(__dirname, './src/entities'),
      '@features': resolve(__dirname, './src/features'),
      '@pages': resolve(__dirname, './src/pages'),
      '@widgets': resolve(__dirname, './src/widgets'),
      '@shared': resolve(__dirname, './src/shared'),
    },
  },
});
