import { ColorType, DefaultTheme } from 'styled-components'

type Colors = 'primary' | 'danger' | 'warn' | 'success' | ColorType

export const commonTheme: Omit<DefaultTheme, Colors> = {
  borderRadius: '4px',
  light: 300,
  normal: 400,
  semiBold: 500,
  bold: 600,
  fontFamilyBase: `'Nunito', sans-serif`,
  fontFamilyMonospace: `'Source Code Pro', monospace`,
}
