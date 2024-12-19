"use client"
import useAdminStore from '@/store/adminStore'
import useUserStore from '@/store/userStore'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import Paciente from '../interfaces/Paciente.interface'

const mockedPacientes: Paciente[] = [
  {
    id: 1,
    nombre: 'Samuel Rosero',
    telefono: '3233112502',
    asignedFormulas: [
      {
        id: 1,
        name: 'Formula 1',
        description: 'Formula 1',
        medicines: [
          {
            id: 1,
            name: 'Medicamento 1',
            description: 'Medicamento 1',
            dosis: '100mg',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    nombre: 'Christian Carrera',
    telefono: '3202154304',
    asignedFormulas: [
      {
        id: 2,
        name: 'Formula 2',
        description: 'Formula 2',
        medicines: [
          {
            id: 2,
            name: 'Medicamento 2',
            description: 'Medicamento 2',
            dosis: '200mg',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    nombre: 'Christian Consultorio',
    telefono: '3003105263',
    asignedFormulas: [],
  },
]

const page = () => {
  const router = useRouter()
  
  const titles = ['Nombre', 'Teléfono', 'Acciones']

  const { pacientes, setPacientes } = useAdminStore()

  useEffect(() => {
    setPacientes(mockedPacientes)
  }, [])

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
                <td>{paciente.nombre}</td>
                <td>{paciente.telefono}</td>
                {actions(paciente.id)}
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  )
}

export default page