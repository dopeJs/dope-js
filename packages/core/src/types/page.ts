import { FunctionComponent, ReactNode } from 'react'

export interface PageProps<K extends string> {
  params: Record<K, string>
}

export interface MelonPage<K extends string = '', P = {}> extends FunctionComponent<P & PageProps<K>> {
  Layout?: (page: ReactNode) => ReactNode
}
