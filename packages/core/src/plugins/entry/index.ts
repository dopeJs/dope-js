import { Plugin } from 'rollup'
import { displayId, moduleId } from './constant'
import { EntryContext } from './context'

export function dopeEntry(pageDir: string): Plugin {
  let ctx: EntryContext

  return {
    name: '@dope-js/plugin-entry',
    // enforce: 'pre',
    // configResolved(config) {
    //   ctx = new EntryContext(pageDir, config.root)
    // },
    options(opts) {
      console.log('opts', opts)
      ctx = new EntryContext(pageDir, process.cwd())
    },
    resolveId(id) {
      if (id === displayId) return moduleId
      return null
    },
    async load(id) {
      if (id === moduleId) return ctx.getFileContent()
      return null
    },
  }
}
