import { useRouter } from '@/hooks'
import { computeMatch } from '@/utils'
import { FC, useEffect, useMemo } from 'react'

export interface RedirectProps {
  /**
   * @description if this path matched, router will push another path
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
   * target path
   */
  to: string

  /**
   * state with route
   */
  state?: unknown
}

export const Redirect: FC<RedirectProps> = ({ path, to, sensitive = false, strict = false, exact = false, state }) => {
  const { pathname, replace } = useRouter()

  const [matched] = useMemo<[boolean, Record<string, unknown> | null]>(() => {
    const [matched, params] = computeMatch(pathname, path, {
      strict,
      sensitive,
      exact,
    })

    if (matched) return [matched, params]
    return [false, null]
  }, [pathname, path, strict, sensitive, exact])

  useEffect(() => {
    if (matched) {
      replace(to, state)
    }
  }, [matched, to, state])

  return null
}
