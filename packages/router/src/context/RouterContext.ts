import { RouterCache } from '@/cache'
import type { IRouterContext } from '@/types'
import { createBrowserHistory } from 'history'
import { createContext } from 'react'

export const defaultHistory = createBrowserHistory()

/**
 * context instance for router
 */
const initValue: IRouterContext = {
  inControl: false,
  history: defaultHistory,
  location: defaultHistory.location,
  prevLocation: defaultHistory.location,
  error: null,
  notFound: null,
  redirect: null,
  cache: new RouterCache(),
  redirectRef: null,
}

export const RouterContext = createContext<IRouterContext>(initValue)
