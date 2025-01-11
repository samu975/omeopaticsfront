import FormularioCreacionPaciente from '@/components/FormularioCreacionPaciente'
import React from 'react'

const page = () => {
  return (
    <div className='p-4 h-screen bg-base-200 flex justify-center items-center flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold text-center md:text-left'>Crear un nuevo paciente</h1>
      </div>
      <div className='shadow-lg p-4 rounded-md bg-slate-700 px-6 py-10'>
        <FormularioCreacionPaciente />
      </div>
      <h3>Lo hacemos un modal ?</h3>
    </div>
  )
}

export default page