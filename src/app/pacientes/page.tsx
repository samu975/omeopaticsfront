"use client"
import useAdminStore from '@/store/adminStore'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'

const page = () => {
  const router = useRouter()
  
  const titles = ['Nombre', 'Teléfono', 'Formularios asignados', 'Acciones']

  const { pacientes, setPacientes } = useAdminStore()

  const fecthPacientes = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/patients`)
    const data = await response.json()
    setPacientes(data)
  }, [])

  useEffect(() => {
    fecthPacientes()
  }, [fecthPacientes])

  const handleViewPaciente = (id: number) => {
    router.push(`/pacientes/${id}/verPaciente`)
  }

  const actions = (id: number) => {
    return (
      <td className='flex gap-3 justify-center items-center'>
        <button className='btn btn-primary' onClick={() => {handleViewPaciente(id)}}>Ver paciente</button>
      </td>
    )
  } 


  return (
    <main className='h-screen bg-base-200 pt-20 px-10'>
      <h1 className='font-bold text-3xl text-white'>Pacientes</h1>
      <table className='table mt-8'>
        <thead className='table-pin-cols'>
          <tr>
            {titles.map((title) => (
              <th className='font-bold text-xl uppercase text-white' key={title}>{title}</th>
            ))}
          </tr>	
        </thead>
        <tbody>
            {pacientes.map((paciente) => (
              <tr key={paciente.id}>
                <td>{paciente.name}</td>
                <td>{paciente.phone}</td>
                <td>{paciente.asignedFormulas.length}</td>
                {actions(paciente.id)}
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  )
}

export default page