'use client'

import Question from '@/app/interfaces/Question.interface'
import Formula from '@/app/interfaces/Formula.interface'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useFormulaStore from '@/store/formulaStore'
import { MdDelete } from 'react-icons/md'
import NavBar from '@/components/NavBar'
import { ObjectId } from 'mongodb'

const EditarFormula = () => {
  const params = useParams()
  const router = useRouter()
  const { id, formulaId } = params

  const [formula, setFormula] = useState<Formula>({
    name: '',
    description: '',
    dosis: '',
    questions: [],
    user: '',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const { updateFormula } = useFormulaStore()

  const fetchFormula = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`)
      if (response.ok) {
        const data = await response.json()
        setFormula({
          ...data,
          questions: data.questions || []
        })
      }
    } catch (error) {
      toast.error('Error al cargar la fórmula')
    }
  }, [formulaId])
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: (formula.questions?.length || 0) + 1,
      text: '',
      type: 'text',
      options: [],
      required: false
    }
    setFormula(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }))
  }
  const handleQuestionChange = (questionId: number, field: keyof Question, value: any) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.map((q: Question) => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const handleAddOption = (questionId: number) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.map((q: Question) => {
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
      })
    }))
  }

  const handleOptionChange = (questionId: number, optionId: number, value: string) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.map((q: Question) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.map((opt: { id: number; text: string }) => 
              opt.id === optionId ? { ...opt, text: value } : opt
            )
          }
        }
        return q
      })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate required fields
      if (!formula.name || !formula.description || !formula.dosis) {
        toast.error('El nombre, la descripción y la dosis son obligatorios')
        return
      }

      // Validate questions
      if (!formula.questions || formula.questions.length === 0) {
        toast.error('Debe agregar al menos una pregunta')
        return
      }

      // Validate each question
      for (const question of formula.questions) {
        if (!question.text) {
          toast.error('Todas las preguntas deben tener un título')
          return
        }
        if ((question.type === 'multiple' || question.type === 'unica') && 
            (!question.options || question.options.length === 0)) {
          toast.error('Las preguntas de tipo múltiple o única deben tener opciones')
          return
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formula,
          questions: formula.questions.map((q: Question) => ({
            ...q,
            options: q.options || []
          }))
        })
      })

      if (response.ok) {
        const updatedFormula = await response.json()
        updateFormula(formulaId as string, updatedFormula)
        toast.success('Fórmula actualizada correctamente', {
          onClose: () => router.push(`/pacientes/${id}/verPaciente`),
          autoClose: 2000
        })
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Error al actualizar la fórmula')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar la fórmula')
    }
  }

  const handleDeleteQuestion = (questionId: number) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.filter((q: Question) => q.id !== questionId)
    }))
  }

  const handleDeleteOption = (questionId: number, optionId: number) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.map((q: Question) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.filter((opt: { id: number; text: string }) => opt.id !== optionId)
          }
        }
        return q
      })
    }))
  }

  useEffect(() => {
    fetchFormula()
  }, [fetchFormula])

  return (
    <div className='p-4 min-h-screen bg-base-200 flex flex-col gap-8 py-20'>
      <NavBar />
      
      <div className='container mx-auto max-w-3xl'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>Editar Fórmula</h1>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label className='label'>Nombre de la fórmula</label>
              <input 
                type="text"
                className='input input-bordered w-full'
                value={formula.name}
                onChange={(e) => setFormula({...formula, name: e.target.value})}
              />
            </div>

            <div>
              <label className='label'>Descripción de la fórmula</label>
              <textarea 
                className='textarea textarea-bordered w-full'
                value={formula.description}
                onChange={(e) => setFormula({...formula, description: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className='label'>Dosis</label>
            <textarea 
              className='textarea textarea-bordered w-full'
              value={formula.dosis}
              onChange={(e) => setFormula({...formula, dosis: e.target.value})}
            />
          </div>

          <div className='space-y-6'>
            {(formula.questions || []).map((question: Question) => (
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
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                  />

                  <select
                    className='select select-bordered w-full'
                    value={question.type}
                    onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value as "abierta" | "multiple" | "unica")}
                  >
                    <option value="abierta">Abierta</option>
                    <option value="multiple">Múltiple</option>
                    <option value="unica">Única</option>
                  </select>

                  {(question.type === 'multiple' || question.type === 'unica') && (
                    <div className='space-y-4'>
                      {question.options?.map((option: { id: number; text: string }) => (
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
              Actualizar Fórmula
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position='bottom-center'/>
    </div>
  )
}

export default EditarFormula