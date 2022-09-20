import { RouterCache } from '@/cache'
import { RedirectFunc, RedirectResult } from '@/types'
import { History, Location, Path, To } from 'history'
import { MutableRefObject, useLayoutEffect } from 'react'
import { appendPrefix, removePrefix } from './metainfo'
import { parsePathname } from './parse'
import { isPromise, pickBy } from './utils'

const appendPreserveParams = (search: string, cache: RouterCache) => {
  const preserveParams = cache.getPreserveParams()

  const searchParams = new URLSearchParams(search)

  for (const key in preserveParams) {
    if (searchParams.has(key)) continue
    searchParams.append(key, preserveParams[key])
  }

  const searchParamsStr = searchParams.toString()

  return searchParamsStr ? '?' + searchParamsStr : searchParamsStr
}

export const handleRoute = async (
  handler: History['push'] | History['replace'],
  to: To,
  location: Location,
  pathname: string,
  redirect: RedirectFunc | null,
  cache: RouterCache,
  state?: unknown
): Promise<void> => {
  let partialPath: Path

  if (typeof to === 'string') {
    if (!to) to = '/'
    partialPath = parsePathname(to)
  } else {
    if (typeof to.pathname !== 'string') {
      /**
       * @breaking_change
       * if no pathname is passed to object params
       * we should keep pathname still instead of changing to '/'
       */
      to.pathname = pathname
    } else if (to.pathname === '') {
      to.pathname = '/'
    }

    partialPath = {
      pathname: to.pathname,
      search: to.search || '',
      hash: to.hash || '',
    }
  }

  const prevLoc = genExposeLoc(location)

  if (typeof redirect === 'function') {
    let redirectedResult: RedirectResult
    const returnValue = redirect(partialPath, prevLoc)
    if (isPromise(returnValue)) {
      const result = await returnValue
      if (!result) {
        redirectedResult = Object.assign({}, partialPath)
      } else if (typeof result === 'string') {
        redirectedResult = parsePathname(result)
      } else if (typeof result === 'object') {
        redirectedResult = Object.assign({}, partialPath, result)
      } else {
        redirectedResult = Object.assign({}, partialPath)
      }
    } else {
      if (!returnValue) {
        redirectedResult = Object.assign({}, partialPath)
      } else if (typeof returnValue === 'string') {
        redirectedResult = parsePathname(returnValue)
      } else if (typeof returnValue === 'object') {
        redirectedResult = Object.assign({}, partialPath, returnValue)
      } else {
        redirectedResult = Object.assign({}, partialPath)
      }
    }

    handler(
      {
        ...redirectedResult,
        pathname: redirectedResult.pathname ? appendPrefix(redirectedResult.pathname) : redirectedResult.pathname,
        search: appendPreserveParams(redirectedResult.search || '', cache),
      },
      state
    )
  } else {
    handler(
      {
        ...partialPath,
        pathname: partialPath.pathname ? appendPrefix(partialPath.pathname) : partialPath.pathname,
        search: appendPreserveParams(partialPath.search || '', cache),
      },
      state
    )
  }
}

export const genExposeLoc = (location: Location) =>
  pickBy(location, (key) => ['pathname', 'hash', 'search'].includes(key))

export const useInitialRedirect = (
  location: Location,
  handler: History['replace'],
  redirect: RedirectFunc | undefined | null,
  cache: RouterCache,
  ref: MutableRefObject<boolean | string>
) => {
  useLayoutEffect(() => {
    ;(async () => {
      if (typeof redirect !== 'function') return

      const pathObj = genExposeLoc(location)

      pathObj.pathname = removePrefix(pathObj.pathname)

      let redirectedResult: RedirectResult

      let finalLoc: Path

      const returnValue = redirect(pathObj, pathObj)

      if (isPromise(returnValue)) {
        redirectedResult = await returnValue
      } else {
        redirectedResult = returnValue
      }

      if (!redirectedResult) return

      if (typeof redirectedResult === 'string') {
        finalLoc = parsePathname(redirectedResult)
      } else if (typeof redirectedResult === 'object') {
        finalLoc = Object.assign({}, pathObj, redirectedResult)
      } else {
        return
      }

      // mark a initial redirect is triggered
      ref.current = finalLoc.pathname

      handler(
        {
          ...finalLoc,
          pathname: finalLoc.pathname ? appendPrefix(finalLoc.pathname) : finalLoc.pathname,
          search: appendPreserveParams(finalLoc.search, cache),
        },
        location.state
      )
    })()
  }, [])
}
