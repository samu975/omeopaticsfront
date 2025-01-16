'use client'

import Formula from '@/app/interfaces/Formula.interface';
import User from '@/app/interfaces/User.interface';
import GoBack from '@/components/GoBack'
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

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

  const fetchPatient = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
    const data = await response.json()
    setPatient(data)
  }, [id])

  const fetchFormulas = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/user/${id}`)
    const data = await response.json()
    setPatient(prevPatient => ({
      ...prevPatient,
      asignedFormulas: data
    }))
  }, [id, setPatient])

  const handleDeleteFormula = async (formulaId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    fetchFormulas()
  }

  const handleDeleteAnswer = async (formulaId: string, answerId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}/answers/${answerId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      fetchFormulas()
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error)
    }
  }

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  useEffect(() => {
    fetchFormulas()
  }, [fetchFormulas])

  return (
    <div className='p-4 h-screen bg-base-200 flex justify-center items-center flex-col gap-8 -mt-10'>
      <div className="flex justify-start w-full">
        <GoBack />
      </div>
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
                  {formula.answers?.map((answer, answerIndex) => (
                    <div 
                      key={`answer-${answer.id || formula._id}-${answerIndex}`} 
                      className="flex items-center justify-between bg-base-300 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{answer.question.title}</p>
                        <p className="text-gray-300">{answer.answer.join(', ')}</p>
                      </div>
                      <button 
                        className="btn btn-circle btn-error btn-sm"
                        onClick={() => handleDeleteAnswer(formula._id || '', answer.id || '')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
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
                      onClick={() => handleDeleteFormula(formula._id || '')}
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
    </div>
  )
}

export default page