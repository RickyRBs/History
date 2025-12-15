import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // IMPORTANT: This must match your GitHub repository name
    // If your repo is https://github.com/username/ciqi-timeline
    // this should be '/ciqi-timeline/'
    base: '/ciqi-timeline/',
    define: {
      // Polyfill process.env.API_KEY for the browser
      // You should create a .env file locally with VITE_API_KEY=your_key
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || '')
    }
  };
});