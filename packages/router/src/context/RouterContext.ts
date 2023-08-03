import { RouterCache } from '@/cache';
import type { IRouterContext } from '@/types';
import { createBrowserHistory } from 'history';
import { createContext } from 'react';

export const browserHistory = createBrowserHistory();

/**
 * context instance for router
 */
const initValue: IRouterContext = {
  inControl: false,
  history: browserHistory,
  location: browserHistory.location,
  prevLocation: browserHistory.location,
  error: null,
  notFound: null,
  redirect: null,
  cache: new RouterCache(),
  redirectRef: null,
};

export const RouterContext = createContext<IRouterContext>(initValue);
