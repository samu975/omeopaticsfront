'use client'

import CreateUser from '@/app/interfaces/CreateUser.interface'
import useAdminStore from '@/store/adminStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
  userId: string;
}

const FormularioEditarPaciente = ({ userId }: Props) => {
  const router = useRouter()
  const [patient, setPatient] = useState<CreateUser>({
    role: 'patient',
    name: '',
    phone: '',
    password: '',
    cedula: ''
  })

  const [error, setError] = useState({
    name: '',
    phone: '',
    cedula: ''
  })

  const { pacientes, setPacientes } = useAdminStore()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Fetch usuario inicial
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setPatient({
            ...data,
            password: data.phone
          })
        }
      } catch (error) {
        toast.error('Error al cargar el paciente')
      }
    }
    fetchPatient()
  }, [userId])

  const updatePaciente = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
      })

      if (response.ok) {
        const updatedPatient = await response.json()
        // Actualizar el store con el paciente actualizado
        setPacientes(pacientes.map(p => 
          p._id === userId ? updatedPatient : p
        ))
        toast.success('Paciente actualizado correctamente', {
          onClose: () => router.push('/pacientes'),
          autoClose: 2000
        })
      } else {
        toast.error('Error al actualizar el paciente')
      }
    } catch (error) {
      toast.error('Error al actualizar el paciente')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let hasError = false

    if (patient.name.length < 3) {
      setError(prev => ({ ...prev, name: 'El nombre debe tener al menos 3 caracteres' }))
      hasError = true
    }
    if (patient.phone.length < 10) {
      setError(prev => ({ ...prev, phone: 'El teléfono debe tener al menos 10 caracteres' }))
      hasError = true
    }
    if (patient.cedula.length < 10) {
      setError(prev => ({ ...prev, cedula: 'La cédula debe tener al menos 10 caracteres' }))
      hasError = true
    }

    if (!hasError) {
      updatePaciente()
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
      <input 
        type="text" 
        name="name" 
        placeholder="Nombre" 
        value={patient.name}
        onChange={handleChange} 
        className='input input-bordered input-primary' 
      />
      <input 
        type="text" 
        name="phone" 
        placeholder="Teléfono" 
        value={patient.phone}
        onChange={handleChange} 
        className='input input-bordered input-primary' 
      />
      <input 
        type="text" 
        name="cedula" 
        placeholder="Cédula" 
        value={patient.cedula}
        onChange={handleChange} 
        className='input input-bordered input-primary' 
      />
      <button type="submit" className='bg-success text-white p-2 rounded-md'>
        Actualizar Paciente
      </button>
      {error.name && <p className='text-red-500'>{error.name}</p>}
      {error.phone && <p className='text-red-500'>{error.phone}</p>}
      {error.cedula && <p className='text-red-500'>{error.cedula}</p>}
      <ToastContainer position='bottom-center'/>
    </form>
  )
}

export default FormularioEditarPaciente