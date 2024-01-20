import { useEffect, useState } from 'react'
import { useUserStore } from '../context/useUserStore'
import { LikeSVG } from './svg/LikeSVG'
import { DislikeSVG } from './svg/DislikeSVG'
import { BASE_URL } from '../api'

interface MessageProps {
  name: string
  image: string
  date: string
  likes: []
  dislikes: []
  message: string
  id: string
}

export const Message: React.FC<MessageProps> = ({
  likes: initialLikes,
  dislikes: initialDislikes,
  id,
  image,
  date,
  name,
  message,
}) => {
  const { currentUser } = useUserStore()

  const [likes, setLikes] = useState<string[]>(initialLikes)
  const [dislikes, setDislikes] = useState<string[]>(initialDislikes)
  const [reaction, setReaction] = useState<'like' | 'dislike' | ''>('')

  useEffect(() => {
    if (currentUser) {
      if (likes.includes(currentUser.id)) {
        setReaction('like')
      } else if (dislikes.includes(currentUser.id)) {
        setReaction('dislike')
      }
    }
  }, [currentUser, likes, dislikes])

  const handleReaction = async (selectedReaction: 'like' | 'dislike' | '') => {
    if (currentUser) {
      try {
        let updatedLikes = [...likes]
        let updatedDislikes = [...dislikes]

        if (selectedReaction === reaction) {
          selectedReaction = ''
          setReaction('')

          if (reaction === 'like') {
            setLikes(likes.filter((id) => id !== currentUser.id))
          } else if (reaction === 'dislike') {
            setDislikes(dislikes.filter((id) => id !== currentUser.id))
          }
          return await fetch(`${BASE_URL}/messages/${id}/reactions`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: selectedReaction }),
            credentials: 'include',
          })
        } else {
          if (selectedReaction === 'like') {
            updatedLikes = [...likes, currentUser.id]
            updatedDislikes = dislikes.filter((id) => id !== currentUser.id)
          } else {
            updatedDislikes = [...dislikes, currentUser.id]
            updatedLikes = likes.filter((id) => id !== currentUser.id)
          }
          setReaction(selectedReaction)
        }

        await fetch(`${BASE_URL}/messages/${id}/reactions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: selectedReaction }),
          credentials: 'include',
        })

        setLikes(updatedLikes)
        setDislikes(updatedDislikes)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const isValidURL = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <section className='flex min-h-[150px] w-full justify-between gap-5 rounded border border-zinc-950 bg-zinc-800 p-2'>
      <div className='flex w-1/3 max-w-[16rem] flex-col items-center justify-center gap-2'>
        <h4 className='flex max-w-[9rem] items-center gap-1 border-4 border-transparent px-2 text-center text-sm font-extrabold'>
          {name}
        </h4>
        <img
          src={
            isValidURL(image)
              ? image
              : 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
          }
          className='h-12 w-12 rounded-full'
          alt='user photo'
        />

        <p className='text-center text-xs'>{date}</p>
        <form
          className='flex items-center gap-3'
          onSubmit={(e) => e.preventDefault()}
        >
          <div className='flex items-center gap-1'>
            <button onClick={() => handleReaction('like')}>
              <LikeSVG reaction={reaction} />
            </button>
            <span>{likes.length}</span>
          </div>
          <div className='flex items-center gap-1'>
            <button onClick={() => handleReaction('dislike')}>
              <DislikeSVG reaction={reaction} />
            </button>
            <span>{dislikes.length}</span>
          </div>
        </form>
      </div>
      <div className='text w-full bg-opacity-100 pl-2'>
        <pre className='max-h-96 overflow-y-auto whitespace-pre-wrap [overflow-wrap:anywhere] '>
          {message}
        </pre>
      </div>
    </section>
  )
}
