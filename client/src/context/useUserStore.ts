import { create } from 'zustand'

interface User {
  id: string
  name: string
  email?: string
  img?: string
}

type UserState = {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  clearCurrentUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
}))
