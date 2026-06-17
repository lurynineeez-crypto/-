import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'echarts': ['echarts'],
          'three': ['three'],
          'lucide': ['lucide-vue-next'],
          'vendor': ['vue', 'socket.io-client']
        }
      }
    }
  }
});
