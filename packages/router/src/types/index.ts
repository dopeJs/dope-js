import type { RouterCache } from '@/cache'
import type { BrowserHistory, Location, Path, To } from 'history'
import type { MutableRefObject, ReactElement } from 'react'

export type RedirectResult = void | undefined | To

export type RedirectFunc = (to: Path, from: Path) => RedirectResult | Promise<RedirectResult>

export interface IRouterContext {
  inControl: boolean
  history: BrowserHistory
  location: Location
  prevLocation: Location
  error: ReactElement | null
  notFound: ReactElement | null
  cache: RouterCache
  redirect: RedirectFunc | null
  redirectRef: MutableRefObject<boolean | string> | null
}

export interface IRouteContext {
  props: Record<string, string> | undefined
}
