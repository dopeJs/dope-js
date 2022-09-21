import { useContext } from 'react'
import { ThemeContext } from '../core'
import { IThemeContext } from '../types'

export function useTheme(): IThemeContext {
  const ctx = useContext(ThemeContext)!
  return ctx
}
