import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {fileURLToPath, URL} from "node:url";
import { loadEnv } from 'vite'


export default defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd(), 'VITE_');
  return {
    base: env.VITE_PUBLIC_PATH,
    plugins: [react()],
    resolve: {
      alias: {
        // '@': path.resolve(__dirname, 'src'),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': '/node_modules',
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: ` @import "./src/assets/styles/global.less"; `,
          javascriptEnabled: true,
        }
      }
    }
  }
})