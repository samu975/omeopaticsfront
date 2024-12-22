"use client"
import Formula from '@/app/interfaces/Formula.interface';
import FormularioCreacion from '@/components/FormularioCreacion';
import useFormulaStore from '@/store/formulaStore';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
  const { formula, setFormula } = useFormulaStore();
  const params = useParams();
  const router = useRouter();

  const [addFollowUp, setAddFollowUp] = useState(false);

  const mockedFormula: Formula = {
    id: 1,
    name: 'Formula 1',
    description: 'Formula 1 description',
    medicines: [
      {
        id: 1,
        name: 'Medicine 1',
        description: 'Medicine 1 description',
        dosis: '10mg'
      },
      {
        id: 2,
        name: 'Medicine 2',
        description: 'Medicine 2 description',
        dosis: '20mg'
      }
    ]
  }

  useEffect(() => {
    const id = params.id;
    setFormula(mockedFormula);
    // TODO: get formula from backend
  }, []);

  const handleSaveFormula = () => {
    router.push(`/formula/seguirFormula/${formula.id}`);
  }

  const randomId = () => {
    return Math.floor(Math.random() * 1000000);
  }

  const handleAddMedicine = () => {
    setFormula({...formula, medicines: [...formula.medicines, {id:  randomId(), name: '', description: '', dosis: ''}]});
  }

  const handleRemoveMedicine = (id: number) => {
    setFormula({...formula, medicines: formula.medicines.filter(medicine => medicine.id !== id)});
  }

  const handleAddFollowUp = () => {
    setAddFollowUp(true);
  }

  return (
    <div className='h-screen bg-base-200 pt-20 px-10'>
      <h1 className='font-bold text-3xl text-white'>Editar formula</h1>
      {formula && (
        <div className='mt-8'>
          <div className='flex flex-col gap-4'>
            <label htmlFor='nombre' className='font-bold text-xl uppercase text-white'>Nombre</label>
            <input type='text' id='nombre' className='input input-bordered' value={formula.name} onChange={(e) => setFormula({...formula, name: e.target.value})} />

            <label htmlFor='descripcion' className='font-bold text-xl uppercase text-white'>Descripcion</label>
            <input type='text' id='descripcion' className='input input-bordered' value={formula.description} onChange={(e) => setFormula({...formula, description: e.target.value})} />

            <label htmlFor='medicinas' className='font-bold text-xl uppercase text-white'>Medicinas</label>
            <button className='btn btn-success' onClick={() => handleAddMedicine()}>Agregar nueva medicina</button>
            <div className='flex flex-col gap-4'>
              {formula.medicines.map((medicine) => (
                <div className='flex flex-col gap-2' key={medicine.id}>
                  <label htmlFor='nombre' className='font-bold text-xl uppercase text-white'>Nombre</label>
                  <input type='text' id='nombre' className='input input-bordered' value={medicine.name} onChange={(e) => setFormula({...formula, medicines: formula.medicines.map(m => m.id === medicine.id ? {...m, name: e.target.value} : m)})} />

                  <label htmlFor='dosis' className='font-bold text-xl uppercase text-white'>Dosis</label>
                  <input type='text' id='dosis' className='input input-bordered' value={medicine.dosis} onChange={(e) => setFormula({...formula, medicines: formula.medicines.map(m => m.id === medicine.id ? {...m, dosis: e.target.value} : m)})} />

                  <label htmlFor='descripcion' className='font-bold text-xl uppercase text-white'>Descripcion</label>
                  <input type='text' id='descripcion' className='input input-bordered' value={medicine.description} onChange={(e) => setFormula({...formula, medicines: formula.medicines.map(m => m.id === medicine.id ? {...m, description: e.target.value} : m)})} />

                  <button className='btn btn-error' onClick={() => handleRemoveMedicine(medicine.id || 0)}>Eliminar</button>
                </div>
              ))}
            </div>
            <button className='btn btn-primary' onClick={() => handleSaveFormula()}>Guardar</button>  
          </div>
          <div className='flex flex-col gap-4'>
              <h2 className='font-bold text-xl uppercase text-white'>Agregar Formulario de seguimiento</h2>
              <button className='btn btn-success' onClick={() => handleAddFollowUp()}>Agregar</button>
          </div>
          {addFollowUp && (
            <FormularioCreacion formulaId={formula.id || 0} />
          )}
        </div>

      )}
    </div>
  )
}

export default page