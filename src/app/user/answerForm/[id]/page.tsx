'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Formula from '@/app/interfaces/Formula.interface'
import Question from '@/app/interfaces/Question.interface'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AnswerFormPage = () => {
  const router = useRouter()
  const params = useParams()
  const formulaId = params.id as string
  
  const [formula, setFormula] = useState<Formula | null>(null)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({})

  useEffect(() => {
    const localStorage = window.localStorage.getItem('user')
    if (!localStorage) {
      router.push('/login')
      return
    }

    const transformedObject = JSON.parse(localStorage)
    setUser(transformedObject.user)

    const fetchFormula = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`)
        const data = await response.json()
        if(!response.ok) {
          setError(data.message)
        } else {
          setFormula(data)
        }
      } catch (error) {
        console.error('Error fetching formula:', error)
        setError('Error al cargar la fórmula')
      }
    }

    fetchFormula()
  }, [formulaId, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formula || !formula.questions) return

    const formattedAnswers = formula.questions.map(question => {
      const answer = answers[question.id];
      let formattedAnswer;
      
      if (question.type === 'multiple') {
        formattedAnswer = Array.isArray(answer) ? answer : [];
      } else if (question.type === 'unica') {
        formattedAnswer = answer ? [answer] : [];
      } else { 
        formattedAnswer = answer ? [answer] : [];
      }

      return {
        question: question.title,
        type: question.type,
        answer: formattedAnswer
      };
    }).filter(answer => answer.answer.length > 0);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (response.ok) {
        toast.success('Respuestas enviadas correctamente');
        setAnswers({});
        router.push('/user/verFormula')
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al enviar las respuestas');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Error al enviar las respuestas');
    }
  };

  if (error) {
    return (
      <div className='min-h-screen bg-base-200 py-20 px-10'>
        <NavBar />
        <div className='container mx-auto'>
          <div className='text-center text-white'>
            <p className='text-xl text-error'>{error}</p>
            <button 
              className='btn btn-primary mt-4'
              onClick={() => router.push('/user/verFormula')}
            >
              Volver a mis fórmulas
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!formula) {
    return (
      <div className='min-h-screen bg-base-200 py-20 px-10'>
        <NavBar />
        <div className='container mx-auto'>
          <div className='text-center text-white'>
            <p className='text-xl'>Cargando fórmula...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-base-200 py-20 px-10'>
      <NavBar />
      <div className='container mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-white'>Responder Seguimiento</h1>
          <button 
            className='btn btn-secondary'
            onClick={() => router.push('/user/verFormula')}
          >
            Volver a mis fórmulas
          </button>
        </div>
        
        <div className='card bg-base-100 shadow-xl p-6'>
          <h2 className='card-title text-primary text-2xl mb-4'>Fórmula {formula.name}</h2>
          <p className='whitespace-pre-wrap mb-4'>{formula.description}</p>
          <div className='mb-6'>
            <p className='text-sm text-gray-500'>Creada el {formula.createdAt && formatDate(formula.createdAt?.toString())}</p>
          </div>
          
          {formula.questions && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-4'>Preguntas de Seguimiento:</h3>
              <form className='space-y-6'>
                {formula.questions.map((question: Question, index) => (
                  <div key={index} className='space-y-2 bg-base-200 p-4 rounded-lg'>
                    <label className='text-gray-600 font-medium'>{question.title}</label>
                    {question.type === 'abierta' && (
                      <textarea
                        className='textarea textarea-bordered w-full'
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                    )}
                    {question.type === 'multiple' && (
                      <div className='space-y-2'>
                        {question.options?.map((option, optionIndex) => (
                          <label key={optionIndex} className='flex items-center space-x-2'>
                            <input
                              type='checkbox'
                              className='checkbox'
                              checked={Array.isArray(answers[question.id]) && 
                                (answers[question.id] as string[]).includes(option.text)}
                              onChange={(e) => {
                                const currentAnswers = answers[question.id] as string[] || []
                                const newAnswers = e.target.checked
                                  ? [...currentAnswers, option.text]
                                  : currentAnswers.filter(a => a !== option.text)
                                handleAnswerChange(question.id, newAnswers)
                              }}
                            />
                            <span>{option.text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {question.type === 'unica' && (
                      <div className='space-y-2'>
                        {question.options?.map((option, optionIndex) => (
                          <label key={optionIndex} className='flex items-center space-x-2'>
                            <input
                              type='radio'
                              className='radio'
                              name={`question-${question.id}`}
                              checked={answers[question.id] === option.text}
                              onChange={() => handleAnswerChange(question.id, option.text)}
                            />
                            <span>{option.text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type='button'
                  className='btn btn-primary mt-6 w-full'
                  onClick={handleSubmit}
                >
                  Enviar Respuestas
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position='bottom-center'/>
    </div>
  )
}

export default AnswerFormPage 