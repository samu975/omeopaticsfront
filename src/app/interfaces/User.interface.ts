import Formula from "./Formula.interface"

interface User {
  id: number
  name: string
  phone: string
  role: 'admin' | 'patient'
  token: string
  asignedFormulas: Formula[]
}

export default User