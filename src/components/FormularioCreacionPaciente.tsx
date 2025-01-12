'use client'

import CreateUser from '@/app/interfaces/CreateUser.interface'
import useAdminStore from '@/store/adminStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState} from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const FormularioCreacionPaciente = () => {
  const router = useRouter()

  const [patient, setPatient] = useState<CreateUser>({
    role: 'patient',
    name: '',
    phone: '',
    password: ''  
  })

  const [error, setError] = useState({
    name: '',
    phone: ''
  })

  const{ pacientes, setPacientes} = useAdminStore()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const postPaciente = async () => {
    patient.password = patient.phone
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patient)
    })
    if (response.status === 201) {
      const data = await response.json()
      setPacientes([...pacientes, data])
      toast.success('Paciente creado correctamente', {
        onClose: () => router.push('/pacientes'),
        autoClose: 2000
      })
    }

    if (response.status === 409) {
      toast.error('No pueden existir pacientes con el mismo numero')
    }
    
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let hasError = false

    if(patient.name.length < 3) {
      setError(prev => ({ ...prev, name: 'El nombre debe tener al menos 3 caracteres' }))
      hasError = true
    }
    if(patient.phone.length < 10) {
      setError(prev => ({ ...prev, phone: 'El teléfono debe tener al menos 10 caracteres' }))
      hasError = true
    }

    if (!hasError) {
      postPaciente()
      handleUnShowError()
    }
  }

  const handleUnShowError = () => {
    if (error) {
      setTimeout(() => {
        setError({ name: '', phone: '' })
      }, 10000);
    }
  }

  useEffect(() => {
    handleUnShowError()
  }, [error])
  
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
      <input type="text" name="name" placeholder="Nombre" onChange={handleChange} className='input input-bordered input-primary' />
      <input type="text" name="phone" placeholder="Teléfono" onChange={handleChange} className='input input-bordered input-primary' />
      <button type="submit" className='bg-success text-white p-2 rounded-md'>Crear Paciente</button>
      {error.name && <p className='text-red-500'>{error.name}</p>}
      {error.phone && <p className='text-red-500'>{error.phone}</p>}
      <ToastContainer position='bottom-center'/>
    </form>

  )
}

export default FormularioCreacionPaciente