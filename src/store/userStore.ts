import Formula from '@/app/interfaces/Formula.interface'
import User from '@/app/interfaces/User.interface'
import { create } from 'zustand'

interface UserState {
  user: User | null
  asignedFormulas: Formula[]
  setUser: (user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  updateAsignedFormulas: (formulas: Formula[]) => void
  updateToken: (token: string) => void
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  asignedFormulas: [],
  setUser: (user: User) => set({ user }),
  logout: () => set({ user: null }),
  updateUser: (user: User) => set({ user }),
  updateAsignedFormulas(formulas) {
    set({ asignedFormulas: formulas })
  },
  updateToken(token) {
    set((state) => ({
      user: state.user ? { ...state.user, token } : null
    }))
  },
}))

export default useUserStore
