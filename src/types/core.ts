import { DefaultTheme } from 'styled-components'

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

export type ColorMap = Record<ColorType, Record<number, string>>

export type ColorFn = (stage: number, alpha?: number) => string

export interface IProviderConfig {
  primary?: ColorType
  danger?: ColorType
  success?: ColorType
  warn?: ColorType
}

export interface IThemeContext {
  dark: boolean
  setDark: (dark: boolean) => void
  setPrimary: (color: ColorType) => void
  setDanger: (color: ColorType) => void
  setSuccess: (color: ColorType) => void
  setWarn: (color: ColorType) => void
  theme: DefaultTheme
}
