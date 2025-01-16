import Formula from "./Formula.interface"

interface User {
  _id: string
  name: string
  phone: string
  role: 'admin' | 'patient'
  token: string
  asignedFormulas: Formula[]
}

export default User