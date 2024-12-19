import Medicamento from "./Medicamento.interface"

interface Formula {
  id?: number
  name: string
  description: string
  medicines: Medicamento[]
}

export default Formula