'use client'

import FormularioCreacionPaciente from '@/components/FormularioCreacionPaciente'
import NavBar from '@/components/NavBar'
import React from 'react'

const page = () => {
  return (
    <div className='p-4 h-screen bg-base-200 flex justify-center items-center flex-col gap-8 -mt-10'>
      <NavBar />
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold text-center md:text-left'>Crear un nuevo paciente</h1>
      </div>
      <div className='shadow-lg p-4 rounded-md bg-slate-700 px-6 py-10'>
        <FormularioCreacionPaciente />
      </div>
    </div>
  )
}

export default page