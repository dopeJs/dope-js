import { defineConfig as viteDefineConfig, mergeConfig, UserConfig as ViteUserConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { melonRouter, RouterOptions } from './plugins'

export { Options, PageOptions, RouterOptions } from './plugins'

export type UserConfig = Omit<ViteUserConfig, 'root' | 'mode' | 'cacheDir'> & {
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
        entry: '/src/index.tsx',
        inject: {
          data: { title },
        },
      }),
    ],
  }

  const mergedConfig: UserConfig = mergeConfig(defaultConfig, config || {})

  return viteDefineConfig(mergedConfig)
}
