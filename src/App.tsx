import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider
} from 'react-router-dom'

import { Items } from '@/pages/Items'
import { Landing } from '@/pages/Landing'
import { Lists } from '@/pages/Lists'
import { Profile } from '@/pages/Profile'
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
      {
        path: '/profile',
        element: <Profile />,
        loader: authLoader,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
