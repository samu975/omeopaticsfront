'use client'

import Formula from '@/app/interfaces/Formula.interface';
import User from '@/app/interfaces/User.interface';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { toast } from 'react-toastify';
import ModalAcceptDelete from '@/components/ModalAcceptDelete';
import { formulaService } from '@/services/api';

type Patient = Omit<User, 'id' | 'token' | 'asignedFormulas'> & {
  _id: string
  asignedFormulas: Formula[]
}

const page = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [patient, setPatient] = useState<Patient>({
    _id: '',
    role: 'patient',
    name: '',
    phone: '',
    cedula: '',
    asignedFormulas: []
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFormulaId, setSelectedFormulaId] = useState('')

  const fetchPatient = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
    const data = await response.json()
    setPatient(data)
  }, [id])

  const fetchFormulas = useCallback(async () => {
    // Obtener el usuario para extraer los IDs de las fórmulas asignadas
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
    const data = await response.json();
    const formulaIds = data.asignedFormulas || [];

    // Obtener los datos completos de cada fórmula
    const formulasData = await Promise.all(
      formulaIds.map(async (formulaId: string) => {
        try {
          return await formulaService.getById(formulaId);
        } catch (e) {
          return null;
        }
      })
    );

    setPatient(prevPatient => ({
      ...prevPatient,
      asignedFormulas: formulasData.filter(Boolean)
    }));
  }, [id, setPatient])

  const handleDeleteFormula = async (formulaId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (data){
      toast.success('Formula eliminada correctamente')
    }
    fetchPatient()
  }

  const openConfirmationModal = (formulaId: string) => {
    setSelectedFormulaId(formulaId)
    setIsModalOpen(true)
  }

  const closeConfirmationModal = () => {
    setSelectedFormulaId('')
    setIsModalOpen(false)
  }

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  useEffect(() => {
    fetchFormulas()
  }, [fetchFormulas])

  return (
    <div className='p-4 h-auto bg-base-200 flex justify-center items-center flex-col gap-8 -mt-10 min-h-screen'>
      <NavBar />
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-center md:text-left">Paciente: <span className='text-primary'>{patient.name}</span> </h1>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Teléfono: <span className='text-primary'>{patient.phone}</span> </h2>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-center md:text-left">Formulas asignadas: </h3>
        <div className="flex flex-col gap-2">
          {patient.asignedFormulas?.map((formula, index) => (
            <div 
              className="flex flex-col gap-2 container bg-slate-700 p-4 rounded-md px-6" 
              key={`formula-${formula._id}-${index}`}
            >
              {formula && (
                <>
                  <h4 className="text-lg font-bold text-center md:text-left">
                    Formula: <span className='text-primary'>{formula.name}</span>
                  </h4>
                  <p className='text-lg text-center md:text-left'>
                    {formula.description}
                  </p>
                  <p className='text-lg text-center md:text-left'>
                    {formula.dosis}
                  </p>
                  {formula.answers?.map((answer, answerIndex) => (
                    <div 
                      key={`answer-${answer.id || formula._id}-${answerIndex}`} 
                      className="flex items-center justify-between bg-base-300 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{answer.question.title}</p>
                        <p className="text-gray-300">{answer.answer.join(', ')}</p>
                        {answer.createdAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            Contestado el: {new Date(answer.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {formula.answers?.length === 0 && 
                    <p className='text-center text-red-500'>El usuario no ha respondido el seguimiento</p>
                  }
                  <div className='flex justify-center gap-2 mt-6'>
                    <button 
                      className='btn btn-secondary' 
                      onClick={() => router.push(`/pacientes/${id}/editarFormula/${formula._id}`)}
                    >
                      Editar formula
                    </button>
                    <button 
                      className='btn btn-error' 
                      onClick={() => openConfirmationModal(formula._id || '')}
                    >
                      Eliminar formula
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {patient.asignedFormulas.length === 0 && 
            <p className='text-center'>No hay formulas asignadas</p>
          }
          <button 
            className='btn btn-success' 
            onClick={() => router.push(`/pacientes/${id}/asignarFormula`)}
          >
            Asignar formula
          </button>
        </div>
      </div>
      
      <ModalAcceptDelete 
        isOpen={isModalOpen}
        title="Eliminar Fórmula"
        message="¿Está seguro que desea eliminar esta fórmula? Esta acción no se puede deshacer."
        onAccept={() => {
          closeConfirmationModal();
          handleDeleteFormula(selectedFormulaId);
        }}
        onClose={closeConfirmationModal}
      />
    </div>
  )
}


export default page