import { useRouter } from '@/hooks'
import { parsePath, Location, To } from 'history'
import { ComponentType, FC, PropsWithChildren, useCallback, useMemo } from 'react'

export interface LinkProps extends PropsWithChildren {
  to: To
  replace?: boolean
  component?: ComponentType<PropsWithChildren & { onClick: () => void }>
}

export const Link: FC<LinkProps> = ({
  to,
  replace: shouldNavigate = false,
  component: Component,
  children,
  ...props
}) => {
  const { push, replace, createHref, location, pathname } = useRouter()

  const normalizedLocation = useMemo<Partial<Location>>(() => {
    const normalizedTo = typeof to === 'string' ? parsePath(to) : to
    return Object.assign({}, location, { pathname }, normalizedTo)
  }, [to])

  const handleClick = useCallback(() => {
    const func = shouldNavigate ? push : replace
    func(createHref(normalizedLocation))
  }, [normalizedLocation, replace])

  if (Component !== undefined) {
    return (
      <Component onClick={handleClick} {...props}>
        {children}
      </Component>
    )
  } else {
    return (
      <a onClick={handleClick} {...props}>
        {children}
      </a>
    )
  }
}
