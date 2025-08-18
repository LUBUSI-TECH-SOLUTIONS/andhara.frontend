import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
// import netlify from "@netlify/vite-plugin";


export default defineConfig({
  plugins: [
    tailwindcss(),
    // netlify()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
})