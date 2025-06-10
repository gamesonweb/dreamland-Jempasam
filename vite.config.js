import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default ({ mode }) => {
    const root = process.cwd()
    return defineConfig({
      base: "./",
      optimizeDeps: {
        exclude: ['@babylonjs/havok']
      }
    })
  }