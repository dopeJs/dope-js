import { RouteContext } from '@/context'
import { useContext } from 'react'

export const useProps = () => {
  return useContext(RouteContext).props
}
