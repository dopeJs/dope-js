import { createGlobalStyle } from '@/styled'
import { FontStyle } from './FontStyle'

export const GlobalStyle = createGlobalStyle`
  ${FontStyle}

  html {
    font-size: 14px;
  }

  body,
  #root {
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-size: 14px;
    font-family: var(--font-family-base);
  }
`
