

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process from 'node:process' to provide proper TypeScript definitions for the process object in the Vite config
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Fix: Use process.cwd() from the explicitly imported process module to identify the project root directory
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY || "")
    },
    plugins: [react()],
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});