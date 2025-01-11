import User from "@/app/interfaces/User.interface"
import { create } from "zustand"

interface AdminState {
  pacientes: User[]
  setPacientes: (pacientes: User[]) => void
  addPaciente: (paciente: User) => void
  deletePaciente: (id: number) => void
  updatePaciente: (paciente: User) => void
}

const useAdminStore = create<AdminState>((set) => ({
  pacientes: [],
  setPacientes: (pacientes: User[]) => set({ pacientes }),
  addPaciente: (paciente: User) => set((state) => ({ pacientes: [...state.pacientes, paciente] })),
  deletePaciente: (id: number) => set((state) => ({ pacientes: state.pacientes.filter((paciente) => paciente.id !== id) })),
  updatePaciente: (paciente: User) => set((state) => ({ pacientes: state.pacientes.map((p) => p.id === paciente.id ? paciente : p) })),
}))

export default useAdminStore