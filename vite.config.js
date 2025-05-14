import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default ({ mode }) => {
    const root = process.cwd()
    return defineConfig({
      optimizeDeps: {
        exclude: ['@babylonjs/havok']
      }
    })
  }