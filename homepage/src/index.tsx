import { App } from '@melon-js/design'
import { RouteProps, Router } from '@melon-js/router'
import { FC, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import pages from '~pages'

const container = document.getElementById('root') || document.createElement('div')
container.id = 'root'
document.body.appendChild(container)

const Entry: FC = () => {
  const routes: Array<RouteProps> = useMemo(() => {
    if (!Array.isArray(pages.routes) || pages.routes.length === 0) return []

    return pages.routes.map((item) => {
      return { path: item.route, dynamic: () => import(item.path) }
    })
  }, [pages.routes])

  return (
    <App options={{ primary: 'orange' }}>
      <Router routes={routes} />
    </App>
  )
}

createRoot(container).render(<Entry />)
