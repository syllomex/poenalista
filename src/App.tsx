import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from 'react-router-dom'

import { Landing } from '@/pages/Landing'
import { Lists } from '@/pages/Lists'
import { Items } from '@/pages/Items'
import { AuthProvider } from '@/providers/auth'

function isAuthorized() {
  const user = JSON.parse(localStorage.getItem('auth-user') ?? 'null')
  return !!user
}

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

function authLoader() {
  if (!isAuthorized()) throw redirect('/')
  return null
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Landing />,
        loader: () => {
          if (isAuthorized()) throw redirect('/lists')
          return null
        },
      },
      {
        path: '/lists',
        element: <Lists />,
        loader: authLoader,
      },
      {
        path: '/lists/:listId',
        element: <Items />,
        loader: authLoader,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
