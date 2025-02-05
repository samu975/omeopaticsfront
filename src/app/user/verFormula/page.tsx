'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Formula from '@/app/interfaces/Formula.interface'
import Question from '@/app/interfaces/Question.interface'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const page = () => {
  const router = useRouter()
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({})

  useEffect(() => {
    const localStorage = window.localStorage.getItem('user')
    if (!localStorage) {
      router.push('/login')
      return
    }

    const transformedObject = JSON.parse(localStorage)
    setUser(transformedObject.user)

    const fetchFormulas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/user/${transformedObject.user._id}`)
        const data = await response.json()
        if(!response.ok) {
          setError(data.message)
        } else {
          setFormulas(data)
        }
      } catch (error) {
        console.error('Error fetching formulas:', error)
      }
    }

    fetchFormulas()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAnswerChange = (formulaId: string, questionId: number, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [`${formulaId}-${questionId}`]: value
    }))
  }

  const handleSubmit = async (formulaId: string, questions: Question[]) => {
    const formattedAnswers = questions.map(question => {
      const answer = answers[`${formulaId}-${question.id}`];
      let formattedAnswer;
      
      if (question.type === 'multiple') {
        formattedAnswer = Array.isArray(answer) ? answer : [];
      } else if (question.type === 'unica') {
        formattedAnswer = answer ? [answer] : [];
      } else { // tipo abierta
        formattedAnswer = answer ? [answer] : [];
      }

      return {
        question: question.title,
        type: question.type,
        answer: formattedAnswer
      };
    }).filter(answer => answer.answer.length > 0); // Only send questions that have answers

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
        // Refresh formulas after submission
        const updatedFormula = await response.json();
        setFormulas(prevFormulas => 
          prevFormulas.map(f => 
            f._id === formulaId ? updatedFormula : f
          )
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al enviar las respuestas');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Error al enviar las respuestas');
    }
  };

  return (
    <div className='min-h-screen bg-base-200 py-20 px-10'>
      <NavBar />
      <div className='container mx-auto'>
        <h1 className='text-4xl font-bold text-white mb-8'>Mis Fórmulas</h1>
        
        {formulas.length === 0 ? (
          <div className='text-center text-white'>
            <p className='text-xl'>No tienes fórmulas asignadas todavía.</p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {formulas.map((formula) => (
              <div key={formula._id} className='card bg-base-100 shadow-xl'>
                <div className='card-body'>
                  <h2 className='card-title text-primary'>Fórmula {formula.name}</h2>
                  <p className='whitespace-pre-wrap'>{formula.description}</p>
                  <div className='mt-4'>
                    <p className='text-sm text-gray-500'>Creada el {formula.createdAt && formatDate(formula.createdAt?.toString())}</p>
                  </div>
                {
                  formula.questions && (
                    <div className='mt-4'>
                      <h3 className='text-lg font-semibold'>Preguntas:</h3>
                      <form className='space-y-4 mt-4'>
                        {formula.questions.map((question: Question, index) => (
                          <div key={index} className='space-y-2'>
                            <label className='text-gray-600 font-medium'>{question.title}</label>
                            {question.type === 'abierta' && (
                              <textarea
                                className='textarea textarea-bordered w-full'
                                value={answers[`${formula._id}-${question.id}`] || ''}
                                onChange={(e) => handleAnswerChange(formula._id || '', question.id, e.target.value)}
                              />
                            )}
                            {question.type === 'multiple' && (
                              <div className='space-y-2'>
                                {question.options?.map((option, optionIndex) => (
                                  <label key={optionIndex} className='flex items-center space-x-2'>
                                    <input
                                      type='checkbox'
                                      className='checkbox'
                                      checked={Array.isArray(answers[`${formula._id}-${question.id}`]) && 
                                        (answers[`${formula._id}-${question.id}`] as string[]).includes(option.text)}
                                      onChange={(e) => {
                                        const currentAnswers = answers[`${formula._id}-${question.id}`] as string[] || []
                                        const newAnswers = e.target.checked
                                          ? [...currentAnswers, option.text]
                                          : currentAnswers.filter(a => a !== option.text)
                                        handleAnswerChange(formula._id || '', question.id, newAnswers)
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
                                      name={`${formula._id}-${question.id}`}
                                      checked={answers[`${formula._id}-${question.id}`] === option.text}
                                      onChange={() => handleAnswerChange(formula._id || '', question.id, option.text)}
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
                          className='btn btn-primary mt-4'
                          onClick={() => handleSubmit(formula._id || '', formula.questions || [])}
                        >
                          Enviar Formulario
                        </button>
                      </form>
                    </div>
                  )
                }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position='bottom-center'/>
    </div>
  )
}

export default page