import Formula from "./Formula.interface"

interface Paciente {
  id: number
  nombre: string
  telefono: string
  asignedFormulas: Formula[]
}

export default Paciente