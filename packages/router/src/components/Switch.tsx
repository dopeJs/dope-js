import { Children, cloneElement, FC, isValidElement, PropsWithChildren, ReactElement, ReactPortal } from 'react'
import { useRouter } from '../hooks'
import { computeMatch, defaultMatchOptions } from '../utils'

export const Switch: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter()

  if (children === undefined) {
    return null
  }

  let renderTarget: ReactElement | ReactPortal | null = null

  Children.forEach(children, (child) => {
    if (renderTarget === null && isValidElement(child)) {
      const {
        path,
        exact = defaultMatchOptions.exact,
        strict = defaultMatchOptions.strict,
        sensitive = defaultMatchOptions.sensitive,
        customMatch,
      } = child.props || {}
      const [matched, params] = computeMatch(pathname, path, {
        exact,
        strict,
        sensitive,
        customMatch,
      })
      if (matched) {
        renderTarget = cloneElement(child, {
          ...child.props,
          switched: true,
          switchedParams: params,
        })
      }
    }
  })

  return renderTarget
}
