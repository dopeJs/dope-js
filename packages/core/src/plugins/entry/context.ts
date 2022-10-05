import { resolve } from 'path'
import { isFile } from './utils'

export class EntryContext {
  private pageDir: string
  private root: string

  constructor(pageDir: string, root = process.cwd()) {
    this.pageDir = pageDir
      .replace(/^\/+/g, '')
      .replace(/\/$/g, '')
      .replace(/\/{2,}/g, '/')

    this.root = root.replace(/\\/g, '/')
  }

  checkUnderScoreAppFile() {
    const path = resolve(this.root, this.pageDir, '_app.tsx')
    return isFile(path)
  }

  async getFileContent() {
    const hasAppFile = await this.checkUnderScoreAppFile()

    return `
    import { Router } from '@dope-js/router'
    import { routes as _routes } from '@dope-js/routes'
    import React from 'react'
    import ReactDom from 'react-dom/client'
    ${hasAppFile ? `import Container from '/${this.pageDir}/_app'` : ''}
    
    export function runApp() {
      const container = document.getElementById('__dope__') || document.createElement('div')
      container.id = '__dope__'
      document.body.appendChild(container)

      const modules = {
        '/src/pages/index.tsx': import('${resolve(this.root, 'src', 'pages', 'index.tsx')}'),
        '/src/pages/test.tsx': import('${resolve(this.root, 'src', 'pages', 'test.tsx')}'),
        '/src/pages/router/[id].tsx': import('${resolve(this.root, 'src', 'pages', 'router', '[id].tsx')}')
      };
            
      const Entry = () => {
        const routes = React.useMemo(() => {
          if (!Array.isArray(_routes) || _routes.length === 0) return []
      
          return _routes.map((item) => {
            return { path: item.route, dynamic: modules[item.path] }
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
