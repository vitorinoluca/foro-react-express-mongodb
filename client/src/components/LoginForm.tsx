import { useState } from 'react'
import { InputForm } from './InputForm'
import { Link, useNavigate } from 'react-router-dom'
import { CloseSVG } from './svg/CloseSVG'
import { BASE_URL } from '../api'
import { Loader } from './Loader'

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    setUsernameError('')
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (usernameError === '' && passwordError === '') {
      if (username.trim() !== '' && password.trim() !== '') {
        setLoading(true)
        const res = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        })
        setLoading(false)
        const data = await res.json()
        if (res.ok) {
          navigate('/')
        }
        if (data.msg.username) {
          setUsernameError(data.msg.username)
        }
        if (data.msg.password) {
          setPasswordError(data.msg.password)
        }
      } else {
        if (username === '') {
          setUsernameError('Ingrese su nombre de usuario.')
        }
        if (password === '') {
          setPasswordError('Ingrese su contraseña')
        }
      }
    }
  }
  return (
    <div className='mx-auto flex h-screen w-full max-w-xl items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='relative flex w-full flex-col justify-center gap-5 bg-zinc-950 px-8 py-10 max-md:h-screen'
      >
        <header className='flex flex-col gap-1'>
          <h2 className='text-center text-2xl font-semibold'>Inicie sesión</h2>
          <div
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            className='absolute right-0 top-0 cursor-pointer px-8 py-10'
          >
            <CloseSVG />
          </div>
        </header>
        <section className='flex flex-col gap-5'>
          <InputForm
            label='Nombre de usuario'
            value={username}
            setValue={handleUsernameChange}
            error={usernameError}
          />
          <InputForm
            label='Contraseña'
            value={password}
            setValue={handlePasswordChange}
            error={passwordError}
            password={true}
          />
        </section>
        <footer>
          <button className='mt-5 h-8 w-full rounded bg-zinc-900 text-sm font-semibold duration-75 hover:bg-zinc-800'>
            Iniciar sesión
          </button>
        </footer>
        <Link
          to='/register'
          className='flex h-8 cursor-pointer items-center justify-center rounded text-center text-sm font-semibold text-blue-600 hover:bg-zinc-900'
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
        {loading && (
          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-zinc-950'>
            <Loader />
          </div>
        )}
      </form>
    </div>
  )
}
