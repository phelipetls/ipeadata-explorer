import { createBrowserRouter, RouterProvider } from 'react-router'
import { SeriesDetails } from './views/SeriesDetails'
import { Home } from './views/Home'
import { Root } from './components/Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'series/:code',
        element: <SeriesDetails />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
