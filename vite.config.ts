/**
 * File: vite.config.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Configure React and Tailwind's Vite integration.
 * Dependencies: Vite, @vitejs/plugin-react, @tailwindcss/vite.
 */
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
