import {
  defineConfig as viteDefineConfig,
  mergeConfig,
  UserConfig as ViteUserConfig,
} from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { melonRouter, RouterOptions } from './plugins'

type UserConfig = Omit<ViteUserConfig, 'root' | 'mode' | 'cacheDir'> & {
  router?: RouterOptions
  title?: string
}

export function defineConfig(config?: UserConfig) {
  const router = config?.router
  const title = config?.title || 'MelonJS'
  const defaultConfig: UserConfig = {
    plugins: [
      melonRouter({ ...router }),
      createHtmlPlugin({
        minify: true,
        template: '/index.html',
        entry: '/index.ts',
        inject: {
          data: { title },
          tags: [
            {
              injectTo: 'body-prepend',
              tag: 'div',
              attrs: {
                id: 'root',
              },
            },
          ],
        },
      }),
    ],
  }

  const mergedConfig: UserConfig = mergeConfig(defaultConfig, config || {})

  return viteDefineConfig(mergedConfig)
}
