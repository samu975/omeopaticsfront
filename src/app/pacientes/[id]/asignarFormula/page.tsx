'use client'

import Question from '@/app/interfaces/Question.interface'
import User from '@/app/interfaces/User.interface'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useFormulaStore from '@/store/formulaStore'
import Formula from '@/app/interfaces/Formula.interface'
import { MdDelete } from 'react-icons/md'
import NavBar from '@/components/NavBar'

type Patient = Omit<User, 'id' | 'token'> & {
  _id: string
}

const page = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [patient, setPatient] = useState<Patient | null>(null)
  const [formulaData, setFormulaData] = useState({
    name: '',
    description: '',
    dosis: ''
  })

  const { addFormula } = useFormulaStore()

  const fetchPatient = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
    const data = await response.json()
    setPatient(data)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formulaData.name || !formulaData.description || !formulaData.dosis) {
      toast.error('Todos los campos son obligatorios')
      return
    }
    const newFormula: Formula = {
      name: formulaData.name,
      description: formulaData.description,
      dosis: formulaData.dosis,
      questions: [],
      answers: []
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${id}/followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormula)
      });
      if (response.ok) {
        const savedFormula = await response.json();
        addFormula(savedFormula);
        toast.success('Fórmula creada correctamente', {
          onClose: () => router.push(`/pacientes/${id}/verPaciente`),
          autoClose: 2000
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al crear la fórmula');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la fórmula');
    }
  };

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  return (
    <div className='bg-base-200 gap-8 py-20 w-full'>
      <NavBar />
      <div className='container mx-auto max-w-3xl'>
        <h1 className='text-2xl font-bold px-8 mb-8 sm:text-3xl md:text-4xl lg:text-5xl'>
          Asignar fórmula al paciente: <span className='text-primary'>{patient?.name}</span>
        </h1>
        <form onSubmit={handleSubmit} className='space-y-6 px-8'>
          <div className='space-y-4'>
            <div>
              <label className='label'>Nombre de la fórmula</label>
              <input 
                type="text"
                className='input input-bordered w-full'
                value={formulaData.name}
                onChange={(e) => setFormulaData({...formulaData, name: e.target.value})}
              />
            </div>
            <div>
              <label className='label'>Descripción de la fórmula</label>
              <textarea 
                className='textarea textarea-bordered w-full'
                value={formulaData.description}
                onChange={(e) => setFormulaData({...formulaData, description: e.target.value})}
              />
            </div>
            <div>
              <label className='label'>Dosis</label>
              <textarea 
                className='textarea textarea-bordered w-full'
                value={formulaData.dosis}
                onChange={(e) => setFormulaData({...formulaData, dosis: e.target.value})}
              />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row gap-4 justify-between'>
            <button
              type="submit"
              className='btn btn-success'
            >
              Guardar Fórmula
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position='bottom-center'/>
    </div>
  )
}

export default page