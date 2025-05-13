'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    formulas: []
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const localStorage = window.localStorage.getItem('user')
    const transformedObject = JSON.parse(localStorage as string)
    if (transformedObject) {
      setUser(transformedObject)
    }

    if (!transformedObject) {
      router.push('/login')
    }
  }, [router])

  const handleCreatePatient = () => {
    router.push('/pacientes/crear')
  }

  const handleFollowPatient = () => {
    router.push('/pacientes')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!isClient) {
    return null
  }

  return (
   <>
   <div className='h-screen bg-base-200 p-6 text-white'>
    <div className='w-full pt-10'>
      <div className='flex justify-end'>
        <button className='btn btn-sm btn-ghost' onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
    <div className='flex flex-col items-center justify-center bg-base-200 p-4 mt-10'>
      <div className='flex flex-col gap-2 my-8'>
        <h1 className='text-4xl font-bold text-left'>Hola, {user.name}</h1>
        <h2 className='text-2xl font-bold text-left'>Bienvenido a la aplicación de formularios</h2>
        <h2 className='text-2xl font-bold text-left'>¿Qué desea hacer?</h2>
      </div>
      <div className='flex flex-col gap-6 lg:flex-row'>
        <button className='btn btn-success' onClick={handleCreatePatient}>Crear un nuevo paciente</button>
        <button className='btn btn-secondary' onClick={handleFollowPatient}>Seguir pacientes</button>
        <button className='btn btn-info' onClick={() => router.push('/banco-preguntas')}>Banco de preguntas</button>
      </div>
    </div>
   </div>
   </>
  );
}
