import { useState } from 'react'
import { InputForm } from './InputForm'
import { BASE_URL } from '../api'
import { Loader } from './Loader'

export const RegisterName: React.FC = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNameChange = (e: string) => {
    setName(e)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`${BASE_URL}/user-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    })
    setLoading(false)
    const data = await res.json()
    if (!res.ok) {
      setError(data.msg)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className='fixed left-0 top-0 flex h-screen w-full items-center justify-center'>
      <div className='fixed left-0 top-0 z-10 h-screen w-full bg-black opacity-45' />
      <form
        onSubmit={handleSubmit}
        className='relative z-50 flex w-full max-w-xl flex-col justify-center gap-5 bg-zinc-950 px-8 py-10 max-md:h-screen'
      >
        <h2 className='text-center text-2xl font-semibold'>
          Ingrese su nombre
        </h2>
        <p className='text-center text-sm text-zinc-500'>
          Este es el nombre con el que los demás te verán.
        </p>
        <InputForm
          label='Nombre'
          value={name}
          setValue={handleNameChange}
          error={error}
        />
        <button className='mt-5 h-8 w-full rounded bg-zinc-900 text-sm font-semibold duration-75 hover:bg-zinc-800'>
          Continuar
        </button>
        {loading && (
          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-zinc-950'>
            <Loader />
          </div>
        )}
      </form>
    </div>
  )
}
