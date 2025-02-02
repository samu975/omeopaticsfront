import React from 'react'

const page = () => {

  const user = {
    name: "Samuel"
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-base-200 px-8 text-white'>
      <div className='flex flex-col gap-2 my-8'>
        <h1 className='text-4xl font-bold text-left py-3'>Hola, {user.name}</h1>
        <h2 className='text-2xl font-bold text-left py-2'>Bienvenido. Aqui podrás ver tus formulas asignadas</h2>
        <h2 className='text-2xl font-bold text-left py-3'>¿Qué desea hacer?</h2>
        <div className='flex flex-col gap-6 lg:flex-row justify-center items-center'>
          <button className='btn btn-secondary btn-md w-10/12'>Ver formulas asignadas</button>
          <button className='btn btn-success btn-md w-10/12'>Contestar preguntas de seguimiento</button>
        </div>
      </div>
    </div>
  )
}

export default page