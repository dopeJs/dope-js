import { defineConfig as viteDefineConfig, mergeConfig, UserConfig as ViteUserConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { melonRouter, RouterOptions } from './plugins'
import { melonEntry } from './plugins/entry'

export { Options, RouterOptions } from './plugins'

export type UserConfig = Omit<ViteUserConfig, 'root' | 'mode' | 'cacheDir'> & {
  router?: RouterOptions
  title?: string
  entry?: string
}

export function defineConfig(config?: UserConfig) {
  const router = config?.router
  const title = config?.title || 'MelonJS'
  const entry = config?.entry || 'src/index.tsx'

  const pageDirs = router?.pagesRoot || 'src/pages'

  const defaultConfig: UserConfig = {
    plugins: [
      melonRouter({ ...router }),
      melonEntry(pageDirs),
      createHtmlPlugin({
        minify: true,
        template: '/index.html',
        entry,
        inject: {
          data: { title },
        },
      }),
    ],
  }

  const mergedConfig: UserConfig = mergeConfig(defaultConfig, config || {})

  return viteDefineConfig(mergedConfig)
}
