import { commonTheme, darkColors, lightColors } from '@/theme'
import {
  ColorFn,
  ColorType,
  IErrorBoundaryProps,
  IProviderConfig,
  IThemeContext,
} from '@/types'
import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import { ErrorBoundary } from './ErrorBoundary'
import { GlobalStyle } from './GlobalStyle'

export const ThemeContext = createContext<IThemeContext | null>(null)

export interface IAppProps extends IErrorBoundaryProps {
  options?: IProviderConfig
  rootId?: string
}

export const App: FC<IAppProps> = ({
  children,
  options,
  fallback,
  onError,
  rootId = 'root',
}) => {
  const [dark, setDark] = useState(false)

  const [primaryColor, setPrimary] = useState<ColorType>(
    options?.primary || 'blue'
  )
  const [dangerColor, setDanger] = useState<ColorType>(options?.danger || 'red')
  const [warnColor, setWarn] = useState<ColorType>(options?.warn || 'yellow')
  const [successColor, setSuccess] = useState<ColorType>(
    options?.success || 'green'
  )

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
    <ErrorBoundary fallback={fallback} onError={onError}>
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
          <GlobalStyle reset rootId={rootId} />
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    </ErrorBoundary>
  )
}
