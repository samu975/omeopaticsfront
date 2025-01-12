'use client'

import Question from '@/app/interfaces/Question.interface'
import Formula from '@/app/interfaces/Formula.interface'
import GoBack from '@/components/GoBack'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useFormulaStore from '@/store/formulaStore'
import { MdDelete } from 'react-icons/md'

const EditarFormula = () => {
  const params = useParams()
  const router = useRouter()
  const { id, formulaId } = params

  const [formula, setFormula] = useState<Formula>({
    name: '',
    description: '',
    questions: []
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

  const handleQuestionChange = (questionId: number, field: keyof Question, value: any) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const handleAddOption = (questionId: number) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
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
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.map(opt => 
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formula)
      })

      if (response.ok) {
        const updatedFormula = await response.json()
        updateFormula(formulaId as string, updatedFormula)
        toast.success('Fórmula actualizada correctamente', {
          onClose: () => router.push(`/pacientes/${id}/verPaciente`),
          autoClose: 2000
        })
      } else {
        toast.error('Error al actualizar la fórmula')
      }
    } catch (error) {
      toast.error('Error al actualizar la fórmula')
    }
  }

  const handleDeleteQuestion = (questionId: number) => {
    setFormula(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  useEffect(() => {
    fetchFormula()
  }, [fetchFormula])

  return (
    <div className='p-4 min-h-screen bg-base-200 flex flex-col gap-8 py-20'>
      <div className='flex justify-start w-full'>
        <GoBack />
      </div>
      
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

          <div className='space-y-6'>
            {(formula.questions || []).map((question) => (
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
                    onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value as "abierta" | "multiple" | "unica")}
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

          <button
            type="submit"
            className='btn btn-success'
          >
            Actualizar Fórmula
          </button>
        </form>
      </div>
      <ToastContainer position='bottom-center'/>
    </div>
  )
}

export default EditarFormula 