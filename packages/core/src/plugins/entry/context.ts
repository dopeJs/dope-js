import { resolve } from 'path'
import { isFile } from './utils'

export class EntryContext {
  private pageDir: string
  private root: string

  constructor(pageDir: string, viteRoot: string = process.cwd()) {
    this.pageDir = pageDir
      .replace(/^\/+/g, '')
      .replace(/\/$/g, '')
      .replace(/\/{2,}/g, '/')

    this.root = viteRoot.replace(/\\/g, '/')
  }

  checkUnderScoreAppFile() {
    const path = resolve(this.root, this.pageDir, '_app.tsx')
    return isFile(path)
  }

  async getFileContent() {
    const hasAppFile = await this.checkUnderScoreAppFile()

    return `
    import { LazyFunc, RouteProps, Router } from '@melon-js/router'
    import { routes as _routes } from '@melon-js/routes'
    import React from 'react'
    import ReactDom from 'react-dom/client'
    ${hasAppFile ? `import Container from '/${this.pageDir}/_app'` : ''}
    
    export function runApp() {
      const container = document.getElementById('root') || document.createElement('div')
      container.id = 'root'
      document.body.appendChild(container)
      
      const modules = import.meta.glob(['/${this.pageDir}/**/*{.tsx,.jsx,.md,.mdx}', '!**/_app.tsx'])
      
      const Entry: React.FC = () => {
        const routes: Array<RouteProps> = React.useMemo(() => {
          if (!Array.isArray(_routes) || _routes.length === 0) return []
      
          return _routes.map((item) => {
            return { path: item.route, dynamic: modules[item.path] as LazyFunc }
          })
        }, [_routes])
      
        return (
          <${hasAppFile ? 'Container' : 'div'} ${hasAppFile ? `page={<Router routes={routes} />}` : ''}>
            ${!hasAppFile ? '<Router routes={routes} />' : ''}
          </${hasAppFile ? 'Container' : 'div'}>
        )
      }
      
      ReactDom.createRoot(container).render(<Entry />)
    }
    `
  }
}
