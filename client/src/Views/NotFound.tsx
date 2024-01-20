export const NotFound: React.FC = () => {
  return (
    <div className='flex h-screen flex-col place-content-center items-center justify-center gap-5 px-4'>
      <h1 className='uppercase tracking-widest text-gray-500'>
        404 | Not Found
      </h1>
      <a
        href='/'
        className='text-center text-sm uppercase tracking-widest text-gray-400 hover:underline'
      >
        Go Home
      </a>
    </div>
  )
}
