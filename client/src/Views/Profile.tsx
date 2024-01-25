import { useEffect, useState } from 'react'
import { useUserStore } from '../context/useUserStore'
import { Message } from '../components/Message'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api'
import { Loader } from '../components/Loader'

type Message = {
  _id: string
  name: string
  likes: []
  dislikes: []
  message: string
  dateTime: string
  img: string
}

export const Profile: React.FC = () => {
  const { currentUser } = useUserStore()
  const [name, setName] = useState<string>(currentUser?.name || '')
  const [email, setEmail] = useState<string>('')
  const [messages, setMessages] = useState([])
  const [img, setImg] = useState<string>(currentUser?.img || '')
  const [emailError, setEmailError] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const [loading, setLoading] = useState(false)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError('')
  }
  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImg = e.target.value

    if (newImg.length <= 200) {
      setImg(newImg)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`${BASE_URL}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, name, img }),
    })
    setLoading(false)

    const data = await res.json()
    if (data.msg.email) {
      if (email != '') {
        setEmailError(data.msg.email)
      }
    }

    if (res.ok) {
      window.location.href = '/'
    }
  }

  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/user/messages`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.msg)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const isValidURL = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <div className='flex flex-wrap items-start justify-center gap-5'>
      <form onSubmit={handleSubmit} className='p-2'>
        <section className='flex items-start justify-center gap-5'>
          <div className='flex flex-col gap-2'>
            <h1 className='mb-10 text-2xl font-semibold'>Mi perfil</h1>
            <div>
              {currentUser?.email ? (
                <div className='flex items-center gap-2'>
                  <label>Email</label>
                  <p>{currentUser.email}</p>
                </div>
              ) : (
                <div className='flex flex-col'>
                  <div className='flex items-center gap-3'>
                    <label>Email</label>
                    <input
                      className={`h-10 ${
                        emailError && 'border-red-500'
                      } border border-zinc-950 bg-transparent px-2 outline-none focus:border-blue-500`}
                      type='text'
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  {emailError && (
                    <p className='text-sm text-red-500'>{emailError}</p>
                  )}
                </div>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <label>Nombre</label>
              <input
                value={name}
                onChange={handleNameChange}
                className='h-10 border border-zinc-950 bg-transparent px-2 outline-none focus:border-blue-500'
                type='text'
              />
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              Imagen
              <input
                value={img}
                onChange={handleImgChange}
                type='text'
                maxLength={200}
                className='h-10  border border-zinc-950 bg-transparent px-2 outline-none focus:border-blue-500'
              />
              <p className='text-sm text-zinc-500'>{img?.length}/200</p>
              <img
                src={
                  isValidURL(img)
                    ? img
                    : 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
                }
                className='h-12 w-12 rounded-full'
                alt='user photo'
              />
            </div>
            <button className='border border-zinc-300 px-3 py-1 text-zinc-300 hover:border-white hover:text-white'>
              Guardar datos
            </button>
            <Link className='w-full border py-1 text-center' to='/'>
              Volver
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                setOpenModal(!openModal)
              }}
              className='border border-red-500 py-1 text-center text-red-500'
            >
              Eliminar cuenta
            </button>
            {openModal && (
              <div className='fixed left-0 top-0 flex h-screen w-full items-center justify-center'>
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenModal(!openModal)
                  }}
                  className='h-screen w-full bg-black opacity-50'
                />
                <div className='absolute flex h-56 flex-col justify-around bg-zinc-950 p-4'>
                  <div className='flex flex-col gap-2 text-center'>
                    <h2 className='text-2xl font-semibold'>
                      Estas seguro que quieres eliminar tu cuenta?
                    </h2>
                    <p className='text-zinc-400'>
                      También se eliminarán todos tus mensajes
                    </p>
                  </div>
                  <div className='flex items-center justify-center gap-1'>
                    <button
                      onClick={async (e) => {
                        e.preventDefault()
                        const res = await fetch(`${BASE_URL}/delete`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                        })
                        console.log(await res.json())
                        if (res.ok) {
                          window.location.href = '/'
                        }
                      }}
                      className='w-full border p-1.5'
                    >
                      Si
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setOpenModal(!openModal)
                      }}
                      className='w-full border p-1.5'
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </form>
      <div>
        <h2 className='text-2xl font-semibold'>Mis mensajes</h2>
        <div className='flex h-full w-full max-w-lg flex-col-reverse items-center justify-center gap-6'>
          {messages.map((message: Message) => {
            const date = new Date(message.dateTime)
            const formattedDate =
              ('0' + date.getDate()).slice(-2) +
              '/' +
              ('0' + (date.getMonth() + 1)).slice(-2) +
              '/' +
              date.getFullYear() +
              ' ' +
              ('0' + date.getHours()).slice(-2) +
              ':' +
              ('0' + date.getMinutes()).slice(-2) +
              ':' +
              ('0' + date.getSeconds()).slice(-2)

            return (
              <Message
                key={message._id}
                name={message.name}
                image={
                  message.img
                    ? message.img
                    : 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
                }
                date={formattedDate}
                likes={message.likes}
                dislikes={message.dislikes}
                message={message.message}
                id={message._id}
              />
            )
          })}
        </div>
      </div>
      {loading && (
        <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-zinc-900'>
          <Loader />
        </div>
      )}
    </div>
  )
}
