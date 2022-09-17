import 'styled-components'
import { ColorFn, ColorType } from '@/types'

interface IPalette {
  main: string
  contrastText: string
}

declare module 'styled-components' {
  type ColorFns = Record<ColorType, ColorFn>

  export interface DefaultTheme extends ColorFns {
    borderRadius: string
    light: number
    normal: number
    bold: number
    semiBold: number
    primary: ColorFn
    danger: ColorFn
    warn: ColorFn
    success: ColorFn
  }
}
