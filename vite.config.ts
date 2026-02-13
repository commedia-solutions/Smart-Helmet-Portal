import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vite.dev/config/
export default defineConfig({

    server: {
    host: '0.0.0.0',   // listen on all network interfaces
    port: 5173,       // or whatever port you like
  },
  
  plugins: [react()],
  define: {
    // make `global` point at `globalThis` in your code
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // ensure imports of "buffer" point at the browser shim
      buffer: 'buffer/',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // polyfill the Buffer global
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }

})
