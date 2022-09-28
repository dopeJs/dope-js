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

  export interface FontWeightTheme {
    light: number
    normal: number
    bold: number
    semiBold: number
  }

  export interface FontSizeTheme {
    base: string
    heading: { h1: string; h2: string; h3: string; h4: string; h5: string; h6: string }
    small: string
  }

  export interface FontFamilyTheme {
    base: string
    monospace: string
  }

  export interface ColorTheme extends ColorFns {
    primary: ColorFn
    danger: ColorFn
    warn: ColorFn
    success: ColorFn
  }

  export interface DefaultTheme {
    colors: ColorTheme
    fontFamily: FontFamilyTheme
    fontSize: FontSizeTheme
    fontWeight: FontWeightTheme
    borderRadius: string
  }
}
