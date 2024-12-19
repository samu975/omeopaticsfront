import { create } from "zustand"

interface UIState {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
}

const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => set({ isModalOpen }),
}))

export default useUIStore