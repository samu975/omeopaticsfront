import FormularioEditarPaciente from '@/components/FormularioEditarPaciente'
import NavBar from '@/components/NavBar'
import React from 'react'

interface Props {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  return (
    <div className='p-4 h-screen bg-base-200 flex justify-center items-center flex-col gap-8 -mt-10'>
      <NavBar />
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold text-center md:text-left'>Editar un paciente</h1>
      </div>
      <FormularioEditarPaciente userId={params.id} />
    </div>
  )
}

export default page