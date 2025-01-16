import Formula from "@/app/interfaces/Formula.interface"
import User from "@/app/interfaces/User.interface"
import { create } from "zustand"

type Paciente = User & {
  _id: string
  asignedFormulas: Formula[]
}

interface AdminState {
  pacientes: Paciente[]
  setPacientes: (pacientes: Paciente[]) => void
  addPaciente: (paciente: Paciente) => void
  deletePaciente: (id: string) => void
  updatePaciente: (paciente: Paciente) => void
}

const useAdminStore = create<AdminState>((set) => ({
  pacientes: [],
  setPacientes: (pacientes: Paciente[]) => set({ pacientes }),
  addPaciente: (paciente: Paciente) => set((state) => ({ pacientes: [...state.pacientes, paciente] })),
  deletePaciente: (id: string) => set((state) => ({ pacientes: state.pacientes.filter((paciente) => paciente._id !== id) })),
  updatePaciente: (paciente: Paciente) => set((state) => ({ pacientes: state.pacientes.map((p) => p._id === paciente._id ? paciente : p) })),
  addFormulaToPaciente: (pacienteId: string, formula: Formula) => set((state) => ({ pacientes: state.pacientes.map((p) => p._id === pacienteId ? { ...p, asignedFormulas: [...p.asignedFormulas, formula] } : p) })),
  removeFormulaFromPaciente: (pacienteId: string, formulaId: string) => set((state) => ({ pacientes: state.pacientes.map((p) => p._id === pacienteId ? { ...p, asignedFormulas: p.asignedFormulas.filter((f) => f._id !== formulaId) } : p) })),
}))

export default useAdminStore