import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../context/useUserStore'
import { BASE_URL } from '../api'

export const Header: React.FC = () => {
  const { currentUser } = useUserStore()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <header className='flex w-full items-center justify-between py-2'>
      <h1 className='text-3xl font-semibold'>Foro</h1>
      {currentUser ? (
        <div
          className='relative flex items-center gap-2 pb-10'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p className='text-sm text-zinc-300'>{currentUser.name}</p>
          <div className=''>
            <img
              src={
                currentUser.img
                  ? currentUser.img
                  : 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
              }
              alt='user photo'
              className='h-10 w-10 rounded-full border border-zinc-300'
            />
            {isHovered && (
              <div className='absolute -bottom-8 right-0 z-50 flex min-w-48 flex-col bg-zinc-950 py-1 text-center'>
                <Link to='/profile' className='w-full py-2 text-center text-sm'>
                  Perfil
                </Link>
                <hr />
                <button
                  onClick={async () => {
                    await fetch(`${BASE_URL}/logout`, {
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                    })
                    window.location.reload()
                  }}
                  className='w-full py-2 text-sm text-zinc-300 duration-75 '
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          <Link
            to='/login'
            className='h-9 rounded border border-zinc-300 px-5 py-1.5 text-sm text-zinc-300 duration-75 hover:border-zinc-200 hover:text-zinc-200'
          >
            Iniciar sesión
          </Link>
          <Link
            to='/register'
            className='h-9 rounded border border-zinc-300 px-5 py-1.5 text-sm text-zinc-300 duration-75 hover:border-zinc-200 hover:text-zinc-200'
          >
            Registrarse
          </Link>
        </div>
      )}
    </header>
  )
}
