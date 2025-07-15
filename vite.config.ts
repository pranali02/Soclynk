import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    global: 'globalThis',
          'process.env.CANISTER_ID_SOCLYNK_BACKEND': JSON.stringify('ulvla-h7777-77774-qaacq-cai'),
    'process.env.DFX_NETWORK': JSON.stringify('local'),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})) 