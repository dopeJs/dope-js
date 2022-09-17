import { commonTheme, darkColors, lightColors } from '@/theme'
import { ColorFn, ColorType, IProviderConfig, IThemeContext } from '@/types'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import { GlobalStyle } from './GlobalStyle'

export const ThemeContext = createContext<IThemeContext | null>(null)

interface IMelonProviderProps {
  options: IProviderConfig
  children: ReactNode
}

export const MelonProvider: FC<IMelonProviderProps> = ({
  children,
  options: { primary, danger, success, warn },
}) => {
  const [dark, setDark] = useState(false)

  const [primaryColor, setPrimary] = useState<ColorType>(primary || 'blue')
  const [dangerColor, setDanger] = useState<ColorType>(danger || 'red')
  const [warnColor, setWarn] = useState<ColorType>(warn || 'yellow')
  const [successColor, setSuccess] = useState<ColorType>(success || 'green')

  const color = useCallback(
    (stage: number, type: ColorType, alpha = 1) => {
      if (alpha < 0) alpha = 0
      if (alpha > 1) alpha = 1

      const colorMap = dark ? darkColors : lightColors
      const colors = colorMap[type]
      const color = colors[stage] || colors[0]

      if (alpha === 1) return color
      const alphaStr = Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, '0')
      return `${color}${alphaStr}`
    },
    [dark]
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme:dark)')
    if (media.matches) setDark(true)
    else setDark(false)
  }, [])

  const primaryFn = useCallback(
    (stage: number, alpha = 1) => color(stage, primaryColor, alpha),
    [primaryColor, color]
  )

  const successFn = useCallback(
    (stage: number, alpha = 1) => color(stage, successColor, alpha),
    [successColor, color]
  )

  const dangerFn = useCallback(
    (stage: number, alpha = 1) => color(stage, dangerColor, alpha),
    [dangerColor, color]
  )

  const warnFn = useCallback(
    (stage: number, alpha = 1) => color(stage, warnColor, alpha),
    [warnColor, color]
  )

  const colorFns: Record<ColorType, ColorFn> = useMemo(() => {
    const colorMap = dark ? darkColors : lightColors
    const types = Object.keys(colorMap) as Array<ColorType>

    return types.reduce((acc, curr) => {
      acc[curr] = (stage, alpha = 1) => color(stage, curr, alpha)
      return acc
    }, {} as Record<ColorType, ColorFn>)
  }, [color, dark])

  const theme: DefaultTheme = useMemo(() => {
    return {
      ...commonTheme,
      primary: primaryFn,
      success: successFn,
      danger: dangerFn,
      warn: warnFn,
      ...colorFns,
    }
  }, [dark])

  return (
    <ThemeContext.Provider
      value={{
        dark,
        setDark,
        setPrimary,
        setDanger,
        setWarn,
        setSuccess,
        theme,
      }}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
