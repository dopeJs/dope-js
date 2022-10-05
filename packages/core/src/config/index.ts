import { mdxPlugin } from '@/mdx'
import { dopeEntry, dopeRouter } from '@/plugins'
import { UserConfig } from '@/types'
import { defineConfig as viteDefineConfig, mergeConfig, Plugin } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export function defineConfig(config?: UserConfig) {
  const router = config?.router
  const title = config?.title || 'DopeJS Page'
  const entry = config?.entry || '/index.tsx'

  const pageDirs = router?.pagesRoot || 'src/pages'

  const defaultConfig: UserConfig = {
    plugins: [
      dopeRouter('', { ...router }) as Plugin,
      dopeEntry(pageDirs, '') as Plugin,
      createHtmlPlugin({
        minify: true,
        template: '/index.html',
        entry,
        inject: {
          data: { title },
        },
      }),
      mdxPlugin(config?.mdx),
    ],
  }

  delete config?.mdx

  const mergedConfig: UserConfig = mergeConfig(defaultConfig, config || {})

  return viteDefineConfig(mergedConfig)
}
