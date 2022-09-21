import { RouterContext } from '@/context'
import { handleRoute, parseSearchParams, removePrefix } from '@/utils'
import type { BrowserHistory, Location, To } from 'history'
import { useCallback, useContext, useMemo } from 'react'

export type UseRouterReturn = {
  push: BrowserHistory['push']
  replace: BrowserHistory['replace']
  back: BrowserHistory['back']
  forward: BrowserHistory['forward']
  createHref: BrowserHistory['createHref']
  location: Location
  prevLocation: Location
  pathname: string
  hash: string
  search: {
    raw: string
    obj: Record<string, string>
  }
  action: string
}

export const useRouter = (): UseRouterReturn => {
  // history contains a location too
  // both location works
  const { history, location, prevLocation, cache, redirect } = useContext(RouterContext)!

  const { hash, search } = location

  const pathname = useMemo(() => {
    return removePrefix(location.pathname)
  }, [location.pathname])

  const { back, forward, push, replace, createHref, action } = history

  const wrapedPush = useCallback(
    (to: To, state?: unknown) => {
      handleRoute(push, to, location, pathname, redirect, cache, state)
    },
    [push, pathname, redirect, cache, location]
  )

  const wrapedReplace = useCallback(
    (to: To, state?: unknown) => {
      handleRoute(replace, to, location, pathname, redirect, cache, state)
    },
    [replace, pathname, redirect, cache, location]
  )

  const searchValue = useMemo(() => {
    return parseSearchParams(search)
  }, [search])

  return {
    ...location,
    action,
    push: wrapedPush,
    replace: wrapedReplace,
    forward,
    back,
    location: {
      ...location,
      pathname,
    },

    prevLocation: {
      ...prevLocation,
      pathname: removePrefix(prevLocation.pathname),
    },
    hash,
    search: searchValue,
    pathname,
    createHref,
  }
}
