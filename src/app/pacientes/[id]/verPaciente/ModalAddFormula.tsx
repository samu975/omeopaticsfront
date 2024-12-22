import Formula from '@/app/interfaces/Formula.interface'
import Medicamento from '@/app/interfaces/Medicamento.interface'
import FormularioCreacion from '@/components/FormularioCreacion'
import useFormulaStore from '@/store/formulaStore'
import useUIStore from '@/store/uiStore'
import { error } from 'console'
import React, { useEffect, useState } from 'react'

const ModalAddFormula = () => {
  const { isModalOpen, setIsModalOpen } = useUIStore()
  const { formula, setFormula } = useFormulaStore()

  const [addFollowUp, setAddFollowUp] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAddFollowUp = () => {
    setAddFollowUp(true);
  }

  const [errors, setErrors] = useState({
    formulaName: false,
    name: false,
    description: false,
    dosis: false,
    medicamentos: false
  })

  const [medicamento, setMedicamento] = useState({
    name: '',
    description: '',
    dosis: ''
  })

  const [medicamentoList, setMedicamentoList] = useState<Medicamento[]>([])

  const [formulaId, setFormulaId] = useState(0);

  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  }

  const handleChangeFormulaName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormula({ ...formula, name: e.target.value })
  } 

  const handleChangeFormulaDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormula({ ...formula, description: e.target.value })
  }

  const handleChangeMedicamento = (e: any ) => {
    setMedicamento({
      ...medicamento,
      [e.target.name]: e.target.value
    })
  }

  const handleOnClickAddMedicamento = () => {
    if (!medicamento.name) {
      setErrors({ ...errors, name: true })
      return
    } else {
      setMedicamentoList([...medicamentoList, medicamento])
      setMedicamento({ name: '', description: '', dosis: '' })
      setFormula({ ...formula, medicines: [...formula.medicines, medicamento] })
    }
  }

  const handleOnClickRemoveMedicamento = (name: string) => {
    setMedicamentoList(medicamentoList.filter((med) => med.name !== name))
  }

  const handleClickSaveFormula = () => {
    if (!formula.name) {
      console.log(errors)
      setErrors({ ...errors, formulaName: true })
      return
    } 


    if (medicamentoList.length === 0) {
      setErrors({ ...errors, medicamentos: true })
      console.log(errors)
      return
    }

    setFormula({ ...formula, medicines: [...formula.medicines, ...medicamentoList], id: formulaId })
    setIsModalOpen(false)
  }

  const nameError = () => {
    if (errors.name) {
      setTimeout(() => {
        setErrors({ ...errors, name: false })
      }, 3000)
      return <p className='text-red-500'>El nombre del medicamento es requerido</p>
    }
  }

  const formulaError = () => {
    if (errors.formulaName ) {
      setTimeout(() => {
        setErrors({ ...errors, formulaName: false })
      }, 3000)
      return <p className='text-red-500'>El nombre de la fórmula es requerido</p>
    }

    if (errors.medicamentos) {
      setTimeout(() => {
        setErrors({ ...errors, medicamentos: false })
      }, 3000)
      return <p className='text-red-500'>Debe agregar al menos un medicamento</p>
    }
  }

  useEffect(() => {
    setFormulaId(generateId());
  }, [])

  const medicamentoForm = () => (
    <>
      <form className='flex flex-col gap-2'>
        <label htmlFor='medicamentoName' className='font-bold text-lg capitalize text-white mt-6'>Nombre del Medicamento</label>
        <input
          type='text'
          id='medicamentoName'
          name='name'
          value={medicamento.name}
          className='input input-bordered'
          onChange={handleChangeMedicamento}
        />
        <label htmlFor='medicamentoDescription' className='font-bold text-lg capitalize text-white'>Indicaciones del Medicamento</label>
        <input
          type='text'
          id='medicamentoDescription'
          name='description'
          value={medicamento.description}
          className='input input-bordered'
          onChange={handleChangeMedicamento}
        />
        <label htmlFor='medicamentoDosis' className='font-bold text-lg capitalize text-white'>Dosis del Medicamento</label>
        <input
          type='text'
          id='medicamentoDosis'
          name='dosis'
          value={medicamento.dosis}
          className='input input-bordered'
          onChange={handleChangeMedicamento}
        />
      </form>
    </>
  )

  return (
    <>
      {isModalOpen && (
        <div className='modal modal-open'>
          <div className='modal-box'>
            <h3 className='text-2xl font-bold'>Agregar fórmula</h3>
            
            {/* Sección de la fórmula */}
            <div className='flex flex-col mt-6 gap-2'>
              <label htmlFor='formulaName' className='font-bold text-lg capitalize text-white'>Nombre de la Fórmula</label>
              <input type='text' id='formulaName' className='input input-bordered' value={formula.name} onChange={handleChangeFormulaName} />
            </div>
            <div className='flex flex-col mt-6 gap-2'>
              <label htmlFor='formulaDescription' className='font-bold text-lg capitalize text-white'>Descripción de la Fórmula</label>
              <textarea 
                id='formulaDescription' 
                className='textarea textarea-bordered' 
                value={formula.description} 
                onChange={handleChangeFormulaDescription}
              ></textarea>
            </div>

            {/* Tabla de medicamentos */}
            {medicamentoList.length > 0 && (
              <div className='mt-6'>
                <h4 className='font-bold text-lg text-white'>Medicamentos Agregados</h4>
                <table className='table-auto w-full mt-4'>
                  <thead>
                    <tr>
                      <th className='text-center'>Nombre</th>
                      <th className='text-center'>Dosis</th>
                      <th className='text-center'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className=''>
                    {medicamentoList.map((med, index) => (
                      <tr key={index} className=''>
                        <td className='text-center'>{med.name}</td>
                        <td className='text-center'>{med.dosis}</td>
                        <td className='text-center'>
                          <button onClick={() => handleOnClickRemoveMedicamento(med.name)} className='btn btn-error'>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Formulario para agregar medicamentos */}
            <div className='mt-6'>
              <h4 className='font-bold text-lg text-white'>Agregar Medicamento</h4>
              {medicamentoForm()}
              <button
                onClick={handleOnClickAddMedicamento}
                className='btn btn-success mt-4'
              >
                Agregar Medicamento
              </button>
            </div>

            <div className='flex flex-col gap-4 mt-6'>
              <button className='btn btn-success' onClick={handleAddFollowUp}>Agregar Formulario de seguimiento</button>
            </div>

            {addFollowUp && (
              <div className='flex flex-col gap-4 mt-6'>
                <FormularioCreacion formulaId={formulaId} />
              </div>
            )}

            {errors.name && nameError()}
            {(errors.formulaName || errors.medicamentos) && formulaError()}
            

            {/* Botones de acción */}
            <div className='flex justify-end mt-6 gap-2'>
              <button onClick={handleCloseModal} className='btn btn-error'>Cancelar</button>
              <button onClick={handleClickSaveFormula} className='btn btn-primary'>Guardar Fórmula</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalAddFormula
