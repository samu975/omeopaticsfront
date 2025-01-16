interface CreateUser {
  name: string
  cedula: string
  phone: string
  role: 'patient' | 'doctor'
  password: string
}

export default CreateUser