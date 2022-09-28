import { Plugin } from 'rollup'
import { displayId, moduleId } from './constant'
import { EntryContext } from './context'

export function dopeEntry(pageDir: string, root: string): Plugin {
  const ctx = new EntryContext(pageDir, root)

  return {
    name: '@dope-js/plugin-runtime',
    // enforce: 'pre',
    // configResolved(config) {
    //   ctx = new EntryContext(pageDir, config.root)
    // },
    resolveId: {
      order: 'pre',
      handler(id) {
        if (id === displayId) return { id: moduleId, external: false }
        return null
      },
    },
    load: {
      order: 'pre',
      handler(id) {
        if (id === moduleId) return ctx.getFileContent()
        return null
      },
    },
  }
}
