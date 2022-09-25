import { ErrorInfo, ReactNode } from 'react'
import { ColorType, DefaultTheme } from 'styled-components'

export interface IErrorBoundaryProps {
  /**
   * The method will be triggered when an error is about to be occurred.
   */
  onError?: (error: Error, info: ErrorInfo) => void
  /**
   * The replacement element when an error is about to be occurred.
   */
  fallback?: ReactNode
  children?: ReactNode
}

export interface AppProps extends IErrorBoundaryProps {
  options?: IProviderConfig
  rootId?: string
}

export type ColorMap = Record<ColorType, Record<number, string>>

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
