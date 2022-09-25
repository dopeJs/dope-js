import { createGlobalStyle, css, FlattenSimpleInterpolation } from 'styled-components'
import { fontCss } from './Fonts'

export interface IGlobalStyleProps {
  /**
   * Customize the global css style.
   */
  css?: FlattenSimpleInterpolation
  /**
   * Use the initial global style.
   */
  reset?: boolean
  /**
   * Customize the root id of the project. (When use `next`, keep it `__next`)
   */
  rootId?: string
}

export const GlobalStyle = createGlobalStyle<IGlobalStyleProps>(
  ({ css: _css, reset, rootId = '__dope__', theme: { neutral } }) => css`
    ${reset
      ? css`
          ${fontCss}

          html {
            font-size: 14px;
          }

          body,
          ${rootId} {
            padding: 0;
            margin: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            font-size: 14px;
            font-family: 'Nunito', sans-serif;
            background-color: ${neutral(0)};
          }
        `
      : css``}

    ${_css && _css}
  `
)
