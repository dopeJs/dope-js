import { FC, ReactNode } from 'react'

export * from './config'
export * from './types/page'

export interface DopeAppProps {
  page: ReactNode
}

export type DopeApp = FC<DopeAppProps>
