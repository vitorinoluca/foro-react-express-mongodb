import { Routes, Route } from 'react-router-dom'
import { Home } from '../Views/Home'
import { AuthGuard } from './AuthGuard'
import { Profile } from '../Views/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { NotFound } from '../Views/NotFound'

export const RouterProvider: React.FC = () => {
  return (
    <main className='min-h-screen bg-zinc-900 text-zinc-200'>
      <ToastContainer />
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </main>
  )
}
