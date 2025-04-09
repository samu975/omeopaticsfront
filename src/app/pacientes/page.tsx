"use client"
import useAdminStore from '@/store/adminStore'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Search from '@/components/Search'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from '@/components/NavBar'
const page = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const { pacientes, setPacientes } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPacienteId, setSelectedPacienteId] = useState('')

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
    if (response.ok && pacientes.length > 0) {
      setPacientes(pacientes.filter(paciente => paciente._id !== id))
      toast.success('Paciente eliminado correctamente')
    } else {
      toast.error('Error al eliminar el paciente')
    }
  }

  const openConfirmationModal = (id: string) => {
    setSelectedPacienteId(id)
    setIsModalOpen(true)
  }

  const closeConfirmationModal = () => {
    setSelectedPacienteId('')
    setIsModalOpen(false)
  }

  // Filtrar pacientes basado en el término de búsqueda
  const filteredPacientes = pacientes.length > 0 ? pacientes.filter(paciente =>
    paciente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.phone.includes(searchTerm) ||
    paciente.cedula?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : null

  const ConfirmationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => {
    return (
      <dialog id="delete_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Desea eliminar el paciente?</h3>
          <div className="modal-action">
            <button className="btn btn-error" onClick={() => {
              onClose()
              handleDeletePaciente(selectedPacienteId)
            }}>Eliminar</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </dialog>
    )
  }

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
          placeholder="Buscar por nombre, teléfono o cédula..."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPacientes && filteredPacientes.map((paciente) => (
            <div key={paciente._id} className="card bg-base-100 shadow-xl">
              <div className="card-body" >
                <h2 className="card-title">{paciente.name}</h2>
                <p key={paciente.phone}>Teléfono: {paciente.phone}</p>
                <p key={paciente.cedula}>Cédula: {paciente.cedula}</p>
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
                  <button className='btn btn-error' onClick={() => openConfirmationModal(paciente._id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <ConfirmationModal 
            isOpen={isModalOpen}
            onClose={closeConfirmationModal}
            onConfirm={() => handleDeletePaciente(selectedPacienteId)}
          />
        )}

        {filteredPacientes && filteredPacientes.length === 0 && searchTerm && (
          <p className="text-center text-gray-500 mt-4">
            No se encontraron pacientes que coincidan con la búsqueda
          </p>
        )}
      </div>
    )
  } 

  return (
    <main className='h-auto bg-base-200 py-20 px-10'>
      <NavBar />
      <h1 className='font-bold text-3xl text-white'>Pacientes</h1>
      {showPacientes()}
      <ToastContainer position='bottom-left' autoClose={3000} />
    </main>
  )
}

export default page