import { fontCss } from '@/components'
import { DopeApp } from '@dope-js/core'
import { App, IProviderConfig } from '@dope-js/design'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  ${fontCss}
`

const MyApp: DopeApp = ({ page }) => {
  const options: IProviderConfig = {
    colors: { primary: 'orange' },
    fontFamily: {
      base: (defaults) => ['Nunito', ...defaults],
      monospace: (defaults) => ['Source Code Pro', ...defaults],
    },
  }

  return (
    <App options={options}>
      <GlobalStyle />
      {page}
    </App>
  )
}

export default MyApp
