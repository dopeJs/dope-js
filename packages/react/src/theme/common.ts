import { ColorType } from '@/types'
import { DefaultTheme } from 'styled-components'

export const commonTheme: Omit<
  DefaultTheme,
  'primary' | 'danger' | 'warn' | 'success' | ColorType
> = {
  borderRadius: '4px',
  light: 300,
  normal: 400,
  semiBold: 500,
  bold: 600,
  fontFamilyBase: `'Nunito', sans-serif`,
  fontFamilyMonospace: `'Source Code Pro', monospace`,
}
