import { ThemeContext } from '@/core'
import { useContext } from 'react'

export function useDark() {
  const { dark, setDark } = useContext(ThemeContext)!

  return { dark, setDark }
}
