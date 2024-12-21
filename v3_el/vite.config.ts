import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd(), 'VITE_');
  return {
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),],
      }),
      Components({
        resolvers: [
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver( { importStyle: 'sass' } )
        ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: ` @import "./src/assets/index.scss"; `
          additionalData: ` @use "@/assets/color.scss" as *; `
        }
      }
    }
  }
})
