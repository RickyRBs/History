import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This must match your GitHub repository name
  // If your repo is https://github.com/username/ciqi-timeline
  // this should be '/ciqi-timeline/'
  base: '/ciqi-timeline/',
});