import nProgress from 'nprogress'
import { Suspense } from 'react'
import routes from '~react-pages'

function App() {
  nProgress.start()
  nProgress.done()

  return <Suspense>{useRoutes(routes)}</Suspense>
}

export default App
