import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  return {
    server: {
      port: 80,
      host: true,
    },
    plugins: [react()],
  }
})
