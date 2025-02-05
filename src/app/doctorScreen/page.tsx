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

  const handleFollowPatient = () => {
    router.push('/pacientes')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
   <>
   <div className='h-screen bg-base-200 p-6'>
    <div className='w-full pt-10'>
      <div className='flex justify-end'>
        <button className='btn btn-sm btn-ghost' onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
    <div className='flex flex-col items-center justify-center bg-base-200 p-4 mt-10'>
      <div className='flex flex-col gap-2 my-8'>
        <h1 className='text-4xl font-bold text-left'>Hola, Christian</h1>
        <h2 className='text-2xl font-bold text-left'>Bienvenido a la aplicación de formularios</h2>
        <h2 className='text-2xl font-bold text-left'>¿Qué desea hacer?</h2>
      </div>
      <div className='flex flex-col gap-6 lg:flex-row'>
        <button className='btn btn-success' onClick={handleCreatePatient}>Crear un nuevo paciente</button>
        <button className='btn btn-secondary' onClick={handleFollowPatient}>Seguir pacientes</button>
      </div>
    </div>
   </div>
   </>
  );
}
