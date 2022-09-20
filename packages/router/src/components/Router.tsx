import { useRouterCache } from '@/cache'
import { RouterContext, defaultHistory } from '@/context'
import type { RedirectFunc } from '@/types'
import { formatRawLocation, setBase, useInitialRedirect } from '@/utils'
import { BrowserHistory, Update as HistoryUpdate, Location } from 'history'
import { FC, PropsWithChildren, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface RouterProps extends PropsWithChildren {
  /**
   * custom browser history instance
   */
  history?: BrowserHistory

  /**
   * path prefix
   */
  base?: string

  /**
   * @error
   * error fallback
   */
  error?: ReactElement

  /**
   * @notFound
   * display when dynamic route matches nothing
   */
  notFound?: ReactElement

  /**
   * @redirect
   * router watcher
   */
  redirect?: RedirectFunc
}

export const Router: FC<RouterProps> = ({ base = '', history: propHistory, children, error, notFound, redirect }) => {
  const historyInstance = propHistory !== undefined ? propHistory : defaultHistory

  const [location, setLocation] = useState<Location>(historyInstance.location)

  const prevRef = useRef<Location>(location)

  useEffect(() => {
    prevRef.current = location
  }, [location])

  const [prevLocation, setPrevLocation] = useState<Location>(historyInstance.location)

  // update router global metainfo `base`
  setBase(base)

  // init browser history instance only once
  const historyRef = useRef<BrowserHistory>(historyInstance)

  const pendingLocation = useRef<Location | null>(null)

  useLayoutEffect(() => {
    // listen location pathname change
    const clearListener = historyRef.current.listen(({ location: newLocation }: HistoryUpdate) => {
      newLocation = formatRawLocation(newLocation)
      if (mounted.current === false) {
        // in case of performing a update when the router is unmounted
        pendingLocation.current = newLocation
      } else {
        // update context value
        setPrevLocation(prevRef.current)
        setLocation(newLocation)
      }
    })

    return () => {
      // clear history listener
      clearListener()
    }
  }, [])

  const cache = useRouterCache()

  // record if a initial redirect action is triggered
  // then the first dynamic promise will not render
  const redirectRef = useRef<boolean | string>(false)

  useInitialRedirect(location, historyInstance.replace, redirect, cache, redirectRef)

  useEffect(() => {
    if (mounted.current === false) {
      // apply pending locUpdate
      if (pendingLocation.current !== null) {
        setLocation(pendingLocation.current)
      }
      // update mount flag
      mounted.current = true
    }
  }, [])

  // if component mounted
  const mounted = useRef(false)

  return (
    <RouterContext.Provider
      value={{
        inControl: true,
        location,
        history: historyRef.current,
        prevLocation,
        notFound: notFound || null,
        error: error || null,
        redirect: redirect || null,
        cache,
        redirectRef: redirectRef,
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}
