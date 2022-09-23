import {} from 'styled-components'

declare module 'styled-components' {
  export type ColorFn = (stage: number, alpha?: number) => string

  export type ColorType =
    | 'blue'
    | 'wathet'
    | 'turquoise'
    | 'green'
    | 'lime'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'carmine'
    | 'violet'
    | 'indigo'
    | 'purple'
    | 'neutral'

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
