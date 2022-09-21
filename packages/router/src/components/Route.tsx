import { RouterContext } from '@/context'
import { useRouter } from '@/hooks'
import { LayoutFunc } from '@/types'
import { computeMatch, CustomMatch, defaultMatchOptions, genId, isPromise } from '@/utils'
import {
  cloneElement,
  ComponentType,
  createElement,
  FC,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ErrorBoundary } from './Error'

export interface RouteProps extends PropsWithChildren {
  /**
   * @static only
   * if current pathname matches props.match
   * props.children will be rendered
   * else <Route> will do nothing
   */
  path: string

  /**
   * should be sensitive to letter upper or lower case
   */
  sensitive?: boolean

  /**
   * if false, will allow pathname tailing with a delimiter
   */
  strict?: boolean

  /**
   * if true, reg will check from tail of pathname
   * else will check from any position of pathname
   */
  exact?: boolean

  /**
   * if switched equals `true`
   * it means route is included by a <Switch> component
   * and now it's already matched
   */
  switched?: boolean
  switchedParams?: Record<string, string>

  /**
   * components to render
   * if component is a Promise, react.lazyComponent will be rendered
   */
  dynamic?: LazyFunc

  /**
   * component's priority is lower than dynamic
   * render no-dynamic react components
   */
  component?: ComponentType<{ params: Record<string, string> }> | ReactElement

  /**
   * user can decide whether a path matches
   */
  customMatch?: CustomMatch

  /**
   * react lazy loading component
   */
  fallback?: ReactNode

  /**
   * if no file match this route
   * display notFound fallback UI
   */
  notFound?: ReactElement

  /**
   * if throw an error
   * display error fallback UI
   */
  error?: ReactElement

  /**
   * dynamic path query
   */
  /**
   * @danger
   * pathQuery is not a satisfied-designed lib property
   * will be removed in next major version
   */
  pathQuery?: Record<string, string>

  /**
   * layout for nextMode
   */
  layout?: LayoutFunc
}

export type LazyFunc = () => Promise<{
  default: ComponentType<DynamicParams>
  layout?: (page: ReactElement) => ReactElement
  failed?: boolean
}>

export enum DynamicStatus {
  none = 'none',
  pending = 'pending',
  loaded = 'loaded',
}

export interface DynamicParams {
  params: Record<string, string>
}

export const Route: FC<RouteProps> = ({
  path,
  dynamic,
  component,
  fallback = null,
  notFound: routeNotFound = null,
  error: routeError = null,
  switched = false,
  sensitive = defaultMatchOptions.sensitive,
  strict = defaultMatchOptions.strict,
  exact = defaultMatchOptions.exact,
  switchedParams,
  customMatch,
  pathQuery,
  children,
}) => {
  // route id
  const routeId = useRef<{ value: number | null }>({ value: null })

  if (routeId.current.value === null) {
    routeId.current.value = genId()
  }

  // current pathname
  const { pathname } = useRouter()

  // get error & notFound ui fallback
  const { error: routerError, notFound: routerNotFound, redirectRef } = useContext(RouterContext)

  const isDynamic = typeof dynamic === 'function'
  const [matched, pathParams] = useMemo<[boolean, Record<string, string>]>(() => {
    if (switched) {
      return [switched, switchedParams || {}]
    }

    const [matched, params] = computeMatch(pathname, path, {
      strict,
      sensitive,
      exact,
      customMatch,
    })

    if (matched) {
      return [matched, params]
    }

    return [false, {}]
  }, [pathname, path, strict, sensitive, exact, customMatch, switched, switchedParams])

  const [fail, setFail] = useState(false)

  const mountRef = useRef<{ mounted: boolean }>({ mounted: false })

  useEffect(() => {
    mountRef.current.mounted = true
    return () => {
      mountRef.current.mounted = false
    }
  }, [])

  useEffect(() => {
    if (mountRef.current.mounted) {
      setFail(false)
    }
  }, [path, pathname])

  // applyed error ui layer
  const error = useMemo(() => {
    return routeError || routerError || null
  }, [routerError, routeError])

  // apply notFound ui layer
  const notFound = useMemo(() => {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {routeNotFound || routerNotFound || null}
      </div>
    )
  }, [routerNotFound, routeNotFound])

  const [dynamicStatus, setDynamicStatus] = useState<DynamicStatus>(DynamicStatus.none)

  const [dynamicElement, setDynamicElement] = useState<ReactElement | null>(null)

  const errorRef = useRef<ErrorBoundary | null>(null)

  const dynamicInst = useRef<{ promise: null | ReturnType<LazyFunc> }>({
    promise: null,
  })

  const layoutRef = useRef<LayoutFunc | null>(null)

  useEffect(() => {
    if (matched && typeof dynamic === 'function') {
      if (redirectRef?.current) {
        if (path !== redirectRef.current) {
          // clear redirectRef in first render
          redirectRef.current = false
          return
        } else {
          // already match redirect path
          redirectRef.current = false
        }
      }
      const returnValue = dynamic()
      dynamicInst.current.promise = returnValue
      if (isPromise(returnValue)) {
        returnValue
          .then((module) => {
            if (dynamicInst.current.promise !== returnValue) return
            if (module && module.failed) {
              if (mountRef.current.mounted) {
                setFail(true)
                setDynamicElement(notFound)
              }
            } else {
              const { default: renderFunction, layout } = module
              const renderElement = createElement<DynamicParams>(renderFunction, {
                params: pathParams || {},
              })
              // preserve last rendered component's layout
              if (typeof layout === 'function') {
                // @todo why use ref: setState in promise's then func will render several times, it will causes some unexpected effects.
                layoutRef.current = layout
              }
              if (mountRef.current.mounted) {
                setDynamicElement(renderElement)
              }
              if (errorRef?.current !== null) {
                errorRef?.current?.clearError()
              }
            }
          })
          .finally(() => {
            if (mountRef.current.mounted) {
              setDynamicStatus(DynamicStatus.loaded)
            }
          })
        if (dynamicElement === null) {
          if (mountRef.current.mounted) {
            setDynamicStatus(DynamicStatus.pending)
          }
        }
      }
    }
  }, [matched, dynamic, path, pathQuery, pathParams])

  const path2staticRef = useRef<Record<string, ReactElement>>({})

  const staticRender = useMemo(() => {
    if (isValidElement(component) || typeof component === 'string') {
      return <>{component}</>
    } else if (typeof component === 'function') {
      if (!matched) return null
      if (Reflect.has(path2staticRef.current, path)) {
        return path2staticRef.current[path] || null
      } else {
        const ele = createElement<{ params: Record<string, string> }>(component, {
          params: pathParams || {},
        })
        path2staticRef.current[path] = ele
        return ele
      }
    } else if (children && isValidElement(children)) {
      return cloneElement(
        children,
        typeof children.type === 'string' ? { ...children.props } : { ...children.props, params: pathParams || {} }
      )
    } else {
      return <>{children}</>
    }
  }, [component, children, pathParams, path])

  if (!matched) return null

  let finalRenderResult: JSX.Element | null

  if (isDynamic) {
    // prefer to apply last rendered component's layout
    // for notFound and pageError case
    if (fail) {
      finalRenderResult = (
        <ErrorBoundary layout={layoutRef.current} pathname={pathname} fallback={error} errorRef={errorRef}>
          {notFound}
        </ErrorBoundary>
      )
    } else if (dynamicStatus === DynamicStatus.pending) {
      finalRenderResult = isValidElement(fallback) ? fallback : null
    } else {
      finalRenderResult = (
        <ErrorBoundary layout={layoutRef.current} pathname={pathname} fallback={error} errorRef={errorRef}>
          {dynamicElement}
        </ErrorBoundary>
      )
    }
  } else {
    // clear redirectRef in first render
    if (redirectRef?.current) {
      if (redirectRef.current !== path && path !== '*') {
        redirectRef.current = false
        return null
      } else {
        redirectRef.current = false
      }
    }
    finalRenderResult = staticRender
  }

  return finalRenderResult
}
