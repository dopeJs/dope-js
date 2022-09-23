import { defineConfig as viteDefineConfig, mergeConfig, UserConfig as ViteUserConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { dopeRouter, RouterOptions } from './plugins'
import { dopeEntry } from './plugins/entry'

export { Options, RouterOptions } from './plugins'

export type UserConfig = Omit<ViteUserConfig, 'root' | 'mode' | 'cacheDir'> & {
  router?: RouterOptions
  title?: string
  entry?: string
}

export function defineConfig(config?: UserConfig) {
  const router = config?.router
  const title = config?.title || 'DopeJS Page'
  const entry = config?.entry || '/index.tsx'

  const pageDirs = router?.pagesRoot || 'src/pages'

  const defaultConfig: UserConfig = {
    plugins: [
      dopeRouter({ ...router }),
      dopeEntry(pageDirs),
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
