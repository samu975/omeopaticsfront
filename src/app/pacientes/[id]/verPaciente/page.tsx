'use client'
import Paciente from '@/app/interfaces/Paciente.interface'
import useAdminStore from '@/store/adminStore'
import useUIStore from '@/store/uiStore'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import ModalAddFormula from './ModalAddFormula'

const page = () => {
  const { pacientes } = useAdminStore()
  const params = useParams()
  const [paciente, setPaciente] = useState<Paciente | undefined>(undefined)
  const { isModalOpen, setIsModalOpen } = useUIStore()

  const fetchPaciente = useCallback(async () => {
    // Todo cuando este el backend, se debe hacer la llamada a la api
    const id = params.id
    const paciente = pacientes.find(paciente => paciente.id === Number(id))
    setPaciente(paciente)
  }, [pacientes])

  useEffect(() => {
    if (!paciente) {
      fetchPaciente()
    }
  }, [fetchPaciente])

  useEffect(() => {
    const id = params.id

    setPaciente(pacientes.find(paciente => paciente.id === Number(id)))
  },[pacientes])

  return (
    <main className='h-screen bg-base-200 pt-20 px-10'>
      <h1 className='font-bold text-3xl text-white'>Agregar formula</h1>
      <div className='mt-8'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='nombre' className='font-bold text-xl uppercase text-white'>Nombre</label>
          <input 
            type='text' 
            id='nombre' 
            className='input input-bordered' 
            value={paciente?.nombre} 
            onChange={(e) => {
              if (paciente) {
                setPaciente({...paciente, nombre: e.target.value})
              }
            }}
          />
        </div>
        <div className='flex flex-col gap-4 my-6'>
          <label htmlFor='telefono' className='font-bold text-xl uppercase text-white'>Telefono</label>
          <input 
            type='text' 
            id='telefono' 
            className='input input-bordered' 
            value={paciente?.telefono} 
            onChange={(e) => {
              if (paciente) {
                setPaciente({...paciente, telefono: e.target.value})
              }
            }}
          />
        </div>
        <div className='flex flex-col gap-4 mt-16'>
          <label htmlFor='medicamentos' className='font-bold text-xl uppercase text-white'>Formulas</label>
          <div className='my-4'>
            <button className='btn btn-success' onClick={() => {setIsModalOpen(true)}}>Agregar formula</button>
          </div>
          {isModalOpen && <ModalAddFormula />}
          <ul className='flex flex-col gap-4 bg-base-300 p-4 rounded-lg'>
            {paciente?.asignedFormulas.map(formula => (
              <li key={formula.id} className='flex justify-between items-center font-bold text-xl'>{formula.name}
                <div className='flex gap-4'>
                  <button className='btn btn-primary'>Editar formula</button>
                  <button className='btn btn-secondary'>Seguimiento</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default page