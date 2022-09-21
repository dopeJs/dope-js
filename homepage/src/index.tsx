import { App } from '@melon-js/design'
import { RouteProps, Router } from '@melon-js/router'
import { FC, useMemo } from 'react'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root') || document.createElement('div')
container.id = 'root'
document.body.appendChild(container)

const Entry: FC = () => {
  const routes: Array<RouteProps> = useMemo(() => {
    return [
      { path: '/', dynamic: () => import('./pages') },
      { path: '/test', dynamic: () => import('./pages/test') },
      { path: '/router/:id', dynamic: () => import('./pages/router/[id]') },
    ]
  }, [])

  return (
    <App options={{ primary: 'orange' }}>
      <Router routes={routes} />
    </App>
  )
}

createRoot(container).render(<Entry />)
