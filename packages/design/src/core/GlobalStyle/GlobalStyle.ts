import { createGlobalStyle, css, FlattenSimpleInterpolation } from 'styled-components'

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
  ({ css: _css, reset, rootId }) => css`
    ${reset
      ? css`
          @import url('https://fonts.font.im/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i|Source+Code+Pro:200,300,400,500,600,700,900&subset=latin-ext,vietnamese');

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
            font-family: 'Nunito', sans-serif;
          }
        `
      : css``}

    ${_css && _css}
  `
)
