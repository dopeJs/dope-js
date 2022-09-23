import { ColorFn, ColorType } from '@dope-js/design'

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
