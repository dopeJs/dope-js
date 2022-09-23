import { ThemeContext } from '@/core'
import { IThemeContext } from '@/types'
import { useContext } from 'react'

export function useTheme(): IThemeContext {
  const ctx = useContext(ThemeContext)!

  return ctx
}
