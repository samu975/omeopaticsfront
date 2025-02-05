'use client'

import Question from '@/app/interfaces/Question.interface'
import User from '@/app/interfaces/User.interface'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useFormulaStore from '@/store/formulaStore'
import Formula from '@/app/interfaces/Formula.interface'
import { MdDelete } from 'react-icons/md'
import NavBar from '@/components/NavBar'

type Patient = Omit<User, 'id' | 'token'> & {
  _id: string
}

const page = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [patient, setPatient] = useState<Patient | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [formulaData, setFormulaData] = useState({
    name: '',
    description: ''
  })

  const { addFormula } = useFormulaStore()

  const fetchPatient = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
    const data = await response.json()
    setPatient(data)
  }, [id])

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      title: '',
      type: 'abierta',
      options: []
    }
    setQuestions([...questions, newQuestion])
  }

  const handleQuestionChange = (questionId: number, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, [field]: value }
      }
      return q
    }))
  }

  const handleAddOption = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption = {
          id: (q.options?.length || 0) + 1,
          text: ''
        }
        return {
          ...q,
          options: [...(q.options || []), newOption]
        }
      }
      return q
    }))
  }

  const handleOptionChange = (questionId: number, optionId: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options?.map(opt => 
            opt.id === optionId ? { ...opt, text: value } : opt
          )
        }
      }
      return q
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formulaData.name || !formulaData.description) {
      toast.error('El nombre y la descripción son obligatorios')
      return
    }

    // Validate questions
    if (!questions || questions.length === 0) {
      toast.error('Debe agregar al menos una pregunta')
      return
    }

    // Validate each question
    for (const question of questions) {
      if (!question.title) {
        toast.error('Todas las preguntas deben tener un título')
        return
      }
      if ((question.type === 'multiple' || question.type === 'unica') && 
          (!question.options || question.options.length === 0)) {
        toast.error('Las preguntas de tipo múltiple o única deben tener opciones')
        return
      }
    }
    
    const newFormula: Formula = {
      name: formulaData.name,
      description: formulaData.description,
      questions: questions.map(q => ({
        ...q,
        options: q.options || []
      })),
      answers: []
    };
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${id}/followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormula)
      });

      if (response.ok) {
        const savedFormula = await response.json();
        addFormula(savedFormula);
        toast.success('Fórmula creada correctamente', {
          onClose: () => router.push(`/pacientes/${id}/verPaciente`),
          autoClose: 2000
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al crear la fórmula');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la fórmula');
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  const handleDeleteOption = (questionId: number, optionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options?.filter(opt => opt.id !== optionId)
        }
      }
      return q
    }))
  }

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  return (
    <div className='p-4 min-h-screen bg-base-200 flex flex-col gap-8 py-20'>
      <NavBar />
      
      <div className='container mx-auto max-w-3xl'>
        <h1 className='text-4xl font-bold mb-8'>
          Asignar fórmula al paciente: <span className='text-primary'>{patient?.name}</span>
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label className='label'>Nombre de la fórmula</label>
              <input 
                type="text"
                className='input input-bordered w-full'
                value={formulaData.name}
                onChange={(e) => setFormulaData({...formulaData, name: e.target.value})}
              />
            </div>

            <div>
              <label className='label'>Descripción de la fórmula</label>
              <textarea 
                className='textarea textarea-bordered w-full'
                value={formulaData.description}
                onChange={(e) => setFormulaData({...formulaData, description: e.target.value})}
              />
            </div>
          </div>

          <div className='space-y-6'>
            {questions.map((question) => (
              <div key={question.id} className='card bg-base-100 shadow-xl p-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-bold text-lg'>Pregunta {question.id}</h3>
                  <button
                    type="button"
                    className='btn btn-ghost btn-circle text-error'
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <MdDelete size={24} />
                  </button>
                </div>
                
                <div className='space-y-4'>
                  <input
                    type="text"
                    placeholder="Título de la pregunta"
                    className='input input-bordered w-full'
                    value={question.title}
                    onChange={(e) => handleQuestionChange(question.id, 'title', e.target.value)}
                  />

                  <select
                    className='select select-bordered w-full'
                    value={question.type}
                    onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                  >
                    <option value="abierta">Abierta</option>
                    <option value="multiple">Múltiple</option>
                    <option value="unica">Única</option>
                  </select>

                  {(question.type === 'multiple' || question.type === 'unica') && (
                    <div className='space-y-4'>
                      {question.options?.map((option) => (
                        <div key={option.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={`Opción ${option.id}`}
                            className='input input-bordered w-full'
                            value={option.text}
                            onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                          />
                          <button 
                            type="button"
                            className="btn btn-circle btn-error btn-sm"
                            onClick={() => handleDeleteOption(question.id, option.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className='btn btn-secondary'
                        onClick={() => handleAddOption(question.id)}
                      >
                        Agregar Opción
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='space-x-4'>
            <button
              type="button"
              className='btn btn-primary'
              onClick={handleAddQuestion}
            >
              Agregar Nueva Pregunta
            </button>

            <button
              type="submit"
              className='btn btn-success'
            >
              Guardar Fórmula
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position='bottom-center'/>
    </div>
  )
}

export default page