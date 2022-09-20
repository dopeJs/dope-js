import { FC, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, RouteObject, useRoutes } from 'react-router-dom'

export const RouterProvider: FC = () => {
  const [routes, setRoutes] = useState<RouteObject[]>([])

  useEffect(() => {
    import('~pages').then((value) => setRoutes(value.default))
  }, [])

  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>
    </BrowserRouter>
  )
}
