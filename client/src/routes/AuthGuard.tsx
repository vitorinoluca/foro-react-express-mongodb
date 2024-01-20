import { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import { BASE_URL } from '../api'
import { useUserStore } from '../context/useUserStore'
import { Outlet, useNavigate } from 'react-router-dom'

export const AuthGuard: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserStore()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setCurrentUser(data.msg)
      } catch (error) {
        console.error(error)
        // No redirigir aquí, simplemente dejar el componente en el estado actual
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setCurrentUser])

  useEffect(() => {
    if (!currentUser && window.location.pathname === '/profile') {
      // Utiliza navigate en lugar de window.location.href para evitar reinicios innecesarios
      navigate('/')
    }
  }, [currentUser, navigate])

  return loading ? (
    <div className='fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-zinc-900'>
      <Loader />
    </div>
  ) : (
    <Outlet />
  )
}
