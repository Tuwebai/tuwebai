import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './client',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  build: {
    outDir: '../dist',
    sourcemap: false,
    // Aumentar el límite de warning para chunks lazy (no afecta el index)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase SDK — chunk propio para no contaminar el bundle principal
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase';
          }
          // framer-motion — chunk propio (~100kB separado del boot)
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          // Radix UI — chunk propio para componentes UI pesados
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix';
          }
          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          // Resto de node_modules van al vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
