import { IRouteContext } from '@/types'
import { createContext } from 'react'

const initValue: IRouteContext = {
  props: undefined,
}

export const RouteContext = createContext<IRouteContext>(initValue)
