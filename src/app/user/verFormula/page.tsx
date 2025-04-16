'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Formula from '@/app/interfaces/Formula.interface'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const VerFormulaPage = () => {
  const router = useRouter()
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
        console.log('Fórmulas recibidas:', data)
        if(!response.ok) {
          setError(data.message)
        } else {
          setFormulas(data)
        }
      } catch (error) {
        console.error('Error fetching formulas:', error)
        setError('Error al cargar las fórmulas')
      }
    }

    fetchFormulas()
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <div className='min-h-screen bg-base-200 py-20 px-10'>
        <NavBar />
        <div className='container mx-auto'>
          <div className='text-center text-white'>
            <p className='text-xl text-error'>{error}</p>
          </div>
        </div>
      </div>
    )
  }

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
                  <div className='divider'></div>
                  <div className='space-y-2'>
                    <div>
                      <h3 className='font-semibold text-lg'>Descripción:</h3>
                      <p className='whitespace-pre-wrap'>{formula.description}</p>
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg text-primary'>Dosis:</h3>
                      <p className='whitespace-pre-wrap'>{formula.dosis || 'No especificada'}</p>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <p className='text-sm text-gray-500'>Creada el {formula.createdAt && formatDate(formula.createdAt?.toString())}</p>
                  </div>
                  <div className='card-actions justify-center mt-4'>
                    <button 
                      className='btn btn-primary'
                      onClick={() => router.push(`/user/answerForm/${formula._id}`)}
                    >
                      Contestar Preguntas de Seguimiento
                    </button>
                  </div>
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

export default VerFormulaPage