'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState} from 'react'

const page = () => {

  const router = useRouter()

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    formulas: []
  })

  useEffect(() => {
    const localStorage = window.localStorage.getItem('user')
    const transformedObject = JSON.parse(localStorage as string)
    if (transformedObject) {
      setUser(transformedObject.user)
    }

    if (!transformedObject) {
      router.push('/login')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleVerFormulas = () => {
    router.push('/user/verFormula')
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-base-200 px-8 text-white'>
    <div className='w-full pt-10'>
      <div className='flex justify-end'>
        <button className='btn btn-sm btn-ghost' onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
      <div className='flex flex-col gap-2 my-8'>
        <h1 className='text-4xl font-bold text-left py-3'>Hola, {user.name}</h1>
        <h2 className='text-2xl font-bold text-left py-2'>Bienvenido. Aqui podrás ver tus formulas asignadas</h2>
        <h2 className='text-2xl font-bold text-left py-3'>¿Qué desea hacer?</h2>
        <div className='flex flex-col gap-6 lg:flex-row justify-center items-center'>
          <button className='btn btn-secondary btn-md w-10/12' onClick={handleVerFormulas}>Ver formulas asignadas</button>
        </div>
      </div>
    </div>
  )
}

export default page