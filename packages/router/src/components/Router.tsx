import { useRouterCache } from '@/cache';
import { browserHistory, RouterContext } from '@/context';
import { RedirectFunc } from '@/types';
import { formatRawLocation, setBase, useInitialRedirect } from '@/utils';
import { BrowserHistory, Update as HistoryUpdate, Location } from 'history';
import { FC, PropsWithChildren, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Route, RouteProps } from './Route';
import { Switch } from './Switch';

export interface RouterProps extends PropsWithChildren {
  /**
   * path prefix
   */
  base?: string;

  /**
   * @error
   * error fallback
   */
  error?: ReactElement;

  /**
   * @notFound
   * display when dynamic route matches nothing
   */
  notFound?: ReactElement;

  /**
   * @redirect
   * router watcher
   */
  redirect?: RedirectFunc;

  /**
   * routes, will ignore children
   */
  routes?: Array<RouteProps>;
}

export const Router: FC<RouterProps> = ({ base = '', children, routes, error, notFound, redirect }) => {
  const [location, setLocation] = useState<Location>(browserHistory.location);

  const prevRef = useRef<Location>(location);

  useEffect(() => {
    prevRef.current = location;
  }, [location]);

  const [prevLocation, setPrevLocation] = useState<Location>(browserHistory.location);

  // update router global metainfo `base`
  setBase(base);

  // init browser history instance only once
  const historyRef = useRef<BrowserHistory>(browserHistory);

  const pendingLocation = useRef<Location | null>(null);

  useLayoutEffect(() => {
    // listen location pathname change
    const clearListener = historyRef.current.listen(({ location: newLocation }: HistoryUpdate) => {
      newLocation = formatRawLocation(newLocation);
      if (mounted.current === false) {
        // in case of performing a update when the router is unmounted
        pendingLocation.current = newLocation;
      } else {
        // update context value
        setPrevLocation(prevRef.current);
        setLocation(newLocation);
      }
    });

    return () => {
      // clear history listener
      clearListener();
    };
  }, []);

  const cache = useRouterCache();

  // record if a initial redirect action is triggered
  // then the first dynamic promise will not render
  const redirectRef = useRef<boolean | string>(false);

  useInitialRedirect(location, browserHistory.replace, redirect, cache, redirectRef);

  useEffect(() => {
    if (mounted.current === false) {
      // apply pending locUpdate
      if (pendingLocation.current !== null) {
        setLocation(pendingLocation.current);
      }
      // update mount flag
      mounted.current = true;
    }
  }, []);

  // if component mounted
  const mounted = useRef(false);

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
      {Array.isArray(routes) && routes.length > 0 ? (
        <Switch>
          {routes.map((item) => (
            <Route key={item.path} {...item} />
          ))}
        </Switch>
      ) : (
        children
      )}
    </RouterContext.Provider>
  );
};
