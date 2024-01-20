import { BrowserRouter } from 'react-router-dom'
import { RouterProvider } from './routes/RouterProvider'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RouterProvider />
    </BrowserRouter>
  )
}
