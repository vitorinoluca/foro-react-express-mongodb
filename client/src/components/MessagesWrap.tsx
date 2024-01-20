import { useEffect, useState } from 'react'
import { Message } from './Message'
import { Loader } from './Loader'
import { BASE_URL } from '../api'

type Message = {
  _id: string
  name: string
  likes: []
  dislikes: []
  message: string
  img: string
  dateTime: string
}

type ApiResponse = {
  success: boolean
  msg: Message[]
}

interface MessagesWrapProps {
  reloadMessages: number
}

export const MessagesWrap: React.FC<MessagesWrapProps> = ({
  reloadMessages,
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/messages`)
      .then((res) => res.json() as Promise<ApiResponse>)
      .then((data) => setMessages(data.msg))
      .finally(() => setLoading(false))
  }, [reloadMessages])

  return (
    <div className='flex h-full w-full flex-col-reverse items-center justify-center gap-6'>
      {loading ? (
        <Loader />
      ) : (
        messages.map((message: Message) => {
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
        })
      )}
    </div>
  )
}
