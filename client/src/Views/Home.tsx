import { useState } from 'react'
import { Header } from '../components/Header'
import { MessagesWrap } from '../components/MessagesWrap'
import { ReloadSVG } from '../components/svg/ReloadSVG'
import { useUserStore } from '../context/useUserStore'
import { RegisterName } from '../components/RegisterName'
import { BASE_URL } from '../api'

export const Home: React.FC = () => {
  const [message, setMessage] = useState<string>('')
  const [reloadMessages, setReloadMessages] = useState<number>(0)
  const [error, setError] = useState<boolean>(false)

  const { currentUser } = useUserStore()

  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(`${BASE_URL}/sent-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ message }),
    })
    if (res.status === 401) {
      setError(true)
    }
    setMessage('')
    setReloadMessages(reloadMessages + 1)
  }
  return (
    <div className='mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center p-3'>
      <Header />
      {error && (
        <p className='flex h-10 w-full items-center justify-center bg-red-600'>
          Inicie sesion para enviar un mensaje
        </p>
      )}
      <form
        className='relative mb-24 mt-5 flex w-full items-end gap-5 max-md:flex-col'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          placeholder='Escribe tu mensaje'
          className={`w-full ${
            error && '!border-red-500'
          } rounded border border-zinc-300 bg-transparent p-2 outline-none focus:border-zinc-200`}
          value={message}
          onChange={handleMessage}
        />
        <button
          type='submit'
          className={`rounded border border-zinc-300 px-10 py-2 text-zinc-300 duration-75 hover:border-zinc-200 hover:text-zinc-200  max-md:w-full ${'disabled:cursor-not-allowed disabled:opacity-50'}`}
          disabled={message.length === 0}
        >
          Postear
        </button>
        <button
          className='absolute -bottom-16 w-full border border-gray-500 bg-zinc-950 p-2'
          title='Recargar'
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          <ReloadSVG />
        </button>
      </form>
      <MessagesWrap reloadMessages={reloadMessages} />
      {currentUser?.id && !currentUser.name && <RegisterName />}
    </div>
  )
}
