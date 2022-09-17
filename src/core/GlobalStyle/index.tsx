import { createGlobalStyle, css } from '@/styled'
import { FontStyle } from './FontStyle'

export interface IGlobalStyleProps {
  /**
   * Customize the global css style.
   */
  css?: string
  /**
   * Use the initial global style.
   */
  reset?: boolean
  /**
   * Customize the root id of the project. (When use `next`, keep it `__next`)
   */
  rootId?: string
}

const defaultStyle = (rootId = 'root') => css`
  ${FontStyle}

  html {
    font-size: 14px;
  }

  body,
  #${rootId} {
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-size: 14px;
    font-family: 14px;
  }
`

export const GlobalStyle = createGlobalStyle<IGlobalStyleProps>(
  ({ css: _css, reset, rootId }) => css`
    ${reset ? defaultStyle(rootId) : ''}
    ${_css}
  `
)
