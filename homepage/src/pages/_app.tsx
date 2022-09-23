import { App } from '@dope-js/design'
import { FC, ReactNode } from 'react'

const MyApp: FC<{ page: ReactNode }> = ({ page }) => {
  return <App>{page}</App>
}

export default MyApp
