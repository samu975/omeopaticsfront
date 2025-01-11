'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const handleCreatePatient = () => {
    router.push('/pacientes/crear')
  }

  const handleCreateFormula = () => {
    router.push('/formulas/crear')
  }

  const handleFollowPatient = () => {
    router.push('/pacientes')
  }

  return (
   <>
    <div className='flex flex-col items-center justify-center h-screen bg-base-200 p-4'>
      <div className='flex flex-col gap-2 my-8'>
        <h1 className='text-4xl font-bold text-left'>Hola, Christian</h1>
        <h2 className='text-2xl font-bold text-left'>Bienvenido a la aplicación de formularios</h2>
        <h2 className='text-2xl font-bold text-left'>¿Qué desea hacer?</h2>
      </div>
      <div className='flex flex-col gap-6 lg:flex-row'>
        <button className='btn btn-success' onClick={handleCreatePatient}>Crear un nuevo paciente</button>
        <button className='btn btn-primary' onClick={handleCreateFormula}>Crear un nuevo formulario</button>
        <button className='btn btn-secondary' onClick={handleFollowPatient}>Seguir pacientes</button>
      </div>
    </div>
   </>
  );
}
