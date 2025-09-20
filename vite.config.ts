import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use base path for production builds (GitHub Pages), but not for development
  const base = mode === 'production' ? '/records-of-amur-isondo/' : '/'

  return {
    plugins: [react()],
    base: base
  }
})