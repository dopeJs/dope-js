import { DopeApp } from '@dope-js/core'
import { App } from '@dope-js/design'

const MyApp: DopeApp = ({ page }) => {
  return <App onError={console.error}>{page}</App>
}

export default MyApp
