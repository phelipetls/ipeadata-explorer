import { createBrowserRouter, RouterProvider } from 'react-router'
import { SeriesDetails } from './views/SeriesDetails'
import { Home } from './views/Home'
import { Root } from './components/Root'
import { EmptyState } from './components/EmptyState'
import { Link } from 'react-router'
import { Button } from './components/Button'

const router = createBrowserRouter(
  [
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
        {
          path: '*',
          element: (
            <div className='flex items-center justify-center h-full min-h-[50vh]'>
              <EmptyState
                title='Página não encontrada'
                description='A página que você está procurando não existe ou foi movida.'
                isCentered
                action={
                  <Button render={<Link to='/' />}>Voltar para o início</Button>
                }
              />
            </div>
          ),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_APP_BASENAME,
  },
)

function App() {
  return <RouterProvider router={router} />
}

export default App
