import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 1234,
    hmr: {
      host: 'localhost',
    },
    watch: { usePolling: true },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  assetsInclude: ['**/*.glb'],
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
  },
  // optimiseDeps: {
  //   exclude: ['@babylonjs/havok'],
  // },
})
