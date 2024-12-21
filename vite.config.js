import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        contact: './contact.html',
        events: './events.html'
      }
    }
  }
}); 