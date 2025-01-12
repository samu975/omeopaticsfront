'use client'

import Question from '@/app/interfaces/Question.interface'
import User from '@/app/interfaces/User.interface'
import GoBack from '@/components/GoBack'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useFormulaStore from '@/store/formulaStore'
import Formula from '@/app/interfaces/Formula.interface'
import { MdDelete } from 'react-icons/md'

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
    
    const newFormula: Formula = {
      name: formulaData.name,
      description: formulaData.description,
      questions: questions,
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
        toast.error('Error al crear la fórmula');
      }
    } catch (error) {
      toast.error('Error al crear la fórmula');
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  return (
    <div className='p-4 min-h-screen bg-base-200 flex flex-col gap-8 py-20'>
      <div className='flex justify-start w-full'>
        <GoBack />
      </div>
      
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
                        <input
                          key={option.id}
                          type="text"
                          placeholder={`Opción ${option.id}`}
                          className='input input-bordered w-full'
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                        />
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