import Paciente from "@/app/interfaces/Paciente.interface"
import { create } from "zustand"

interface AdminState {
  pacientes: Paciente[]
  setPacientes: (pacientes: Paciente[]) => void
  addPaciente: (paciente: Paciente) => void
  deletePaciente: (id: number) => void
  updatePaciente: (paciente: Paciente) => void
}

const useAdminStore = create<AdminState>((set) => ({
  pacientes: [],
  setPacientes: (pacientes: Paciente[]) => set({ pacientes }),
  addPaciente: (paciente: Paciente) => set((state) => ({ pacientes: [...state.pacientes, paciente] })),
  deletePaciente: (id: number) => set((state) => ({ pacientes: state.pacientes.filter((paciente) => paciente.id !== id) })),
  updatePaciente: (paciente: Paciente) => set((state) => ({ pacientes: state.pacientes.map((p) => p.id === paciente.id ? paciente : p) })),
}))

export default useAdminStore