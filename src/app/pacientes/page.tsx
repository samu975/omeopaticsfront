"use client"
import useAdminStore from '@/store/adminStore'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import GoBack from '@/components/GoBack'
import Search from '@/components/Search'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const page = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const { pacientes, setPacientes } = useAdminStore()

  const fecthPacientes = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
    const data = await response.json()
    setPacientes(data)
  }, [])

  useEffect(() => {
    fecthPacientes()
  }, [fecthPacientes])

  const handleDeletePaciente = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      setPacientes(pacientes.filter(paciente => paciente._id !== id))
      toast.success('Paciente eliminado correctamente')
    } else {
      toast.error('Error al eliminar el paciente')
    }
  }

  // Filtrar pacientes basado en el término de búsqueda
  const filteredPacientes = pacientes.filter(paciente =>
    paciente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.phone.includes(searchTerm)
  )

  const showPacientes = () => {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/pacientes/crear" className="btn btn-primary">
            Crear Paciente
          </Link>
        </div>

        <Search 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por nombre o teléfono..."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPacientes.map((paciente) => (
            <div key={paciente._id} className="card bg-base-100 shadow-xl">
              <div className="card-body" >
                <h2 className="card-title">{paciente.name}</h2>
                <p key={paciente._id}>Teléfono: {paciente.phone}</p>
                <div className="card-actions">
                  <Link 
                    href={`/pacientes/${paciente._id}/verPaciente`}
                    className="btn btn-primary"
                    key={`link-${paciente._id}`}
                  >
                    Ver Paciente
                  </Link>
                  <Link 
                    href={`/pacientes/editar/${paciente._id}`}
                    className='btn btn-secondary'
                  >
                    Editar
                  </Link>
                  <button className='btn btn-error' onClick={() => handleDeletePaciente(paciente._id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPacientes.length === 0 && searchTerm && (
          <p className="text-center text-gray-500 mt-4">
            No se encontraron pacientes que coincidan con la búsqueda
          </p>
        )}
      </div>
    )
  } 

  return (
    <main className='h-auto bg-base-200 py-20 px-10'>
      <div className="flex justify-start w-full mb-10 -mt-10">
        <GoBack />
      </div>
      <h1 className='font-bold text-3xl text-white'>Pacientes</h1>
      {showPacientes()}
      <ToastContainer position='bottom-left' autoClose={3000} />
    </main>
  )
}

export default page