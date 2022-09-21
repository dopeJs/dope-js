import { ColorFn, ColorType } from './types'

export * from './components'
export * from './core'
export * from './styled'
export * from './types'

declare module 'styled-components' {
  type ColorFns = Record<ColorType, ColorFn>

  export interface DefaultTheme extends ColorFns {
    borderRadius: string
    light: number
    normal: number
    bold: number
    semiBold: number
    fontFamilyBase: string
    fontFamilyMonospace: string
    primary: ColorFn
    danger: ColorFn
    warn: ColorFn
    success: ColorFn
  }
}
