'use client'

import Formula from '@/app/interfaces/Formula.interface';
import User from '@/app/interfaces/User.interface';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { toast } from 'react-toastify';
import ModalAcceptDelete from '@/components/ModalAcceptDelete';
import { formulaService } from '@/services/api';

type Patient = Omit<User, 'id' | 'token' | 'asignedFormulas'> & {
  _id: string
  asignedFormulas: Formula[]
}

const page = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [patient, setPatient] = useState<Patient>({
    _id: '',
    role: 'patient',
    name: '',
    phone: '',
    cedula: '',
    asignedFormulas: []
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFormulaId, setSelectedFormulaId] = useState('')

  const fetchPatient = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
    const data = await response.json()
    setPatient(data)
  }, [id])

  const fetchFormulas = useCallback(async () => {
    try {
      // Obtener el usuario con sus fórmulas
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
      const userData = await response.json();
      const formulaIds = userData.asignedFormulas || [];

      // Obtener los datos completos de cada fórmula
      const formulasData = await Promise.all(
        formulaIds.map(async (formulaId: string) => {
          try {
            const formula = (await formulaService.getById(formulaId) as unknown) as Formula;
            
            // Obtener los datos de cada banco de preguntas
            if (formula.questionBanks) {
              formula.questionBanks = await Promise.all(
                formula.questionBanks.map(async (bank) => {
                  try {
                    const bankResponse = await fetch(`/api/banco-preguntas/${bank.bankId}`);
                    const bankData = await bankResponse.json();
                    return {
                      ...bank,
                      name: bankData.name,
                      questions: bankData.questions
                    };
                  } catch (e) {
                    return bank;
                  }
                })
              );
            }
            
            return formula;
          } catch (e) {
            return null;
          }
        })
      );

      setPatient(prevPatient => ({
        ...prevPatient,
        asignedFormulas: formulasData.filter(Boolean)
      }));
    } catch (error) {
      console.error('Error fetching formulas:', error);
    }
  }, [id]);

  const handleDeleteFormula = async (formulaId: string) => {
    try {
      // Eliminar la fórmula
      const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${formulaId}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        // Actualizar el usuario para remover la fórmula de asignedFormulas
        const updateUserResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${patient._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            asignedFormulas: patient.asignedFormulas.map(f => f._id).filter(id => id !== formulaId)
          })
        });

        if (updateUserResponse.ok) {
          toast.success('Fórmula eliminada correctamente');
          fetchFormulas(); // Actualizar la vista
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la fórmula');
    }
  };

  const openConfirmationModal = (formulaId: string) => {
    setSelectedFormulaId(formulaId)
    setIsModalOpen(true)
  }

  const closeConfirmationModal = () => {
    setSelectedFormulaId('')
    setIsModalOpen(false)
  }

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  useEffect(() => {
    fetchFormulas()
  }, [fetchFormulas])

  return (
    <div className='p-4 h-auto bg-base-200 flex justify-center items-center flex-col gap-8 -mt-10 min-h-screen'>
      <NavBar />
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-center md:text-left">Paciente: <span className='text-primary'>{patient.name}</span> </h1>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Teléfono: <span className='text-primary'>{patient.phone}</span> </h2>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-center md:text-left">Formulas asignadas: </h3>
        <div className="flex flex-col gap-2">
          {patient.asignedFormulas?.map((formula, index) => (
            <div 
              className="flex flex-col gap-4 container bg-slate-700 p-6 rounded-md" 
              key={`formula-${formula._id}-${index}`}
            >
              {formula && (
                <>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">
                      Fórmula: <span className='text-primary'>{formula.name}</span>
                    </h4>
                    <p className='text-lg'>
                      <span className="font-semibold">Descripción:</span>{' '}
                      <span className="text-gray-300">{formula.description}</span>
                    </p>
                    <p className='text-lg'>
                      <span className="font-semibold">Dosis:</span>{' '}
                      <span className="text-gray-300">{formula.dosis}</span>
                    </p>
                  </div>

                  {formula.questionBanks?.map((bank, bankIndex) => (
                    <div key={`bank-${bank.bankId}-${bankIndex}`} className="bg-base-300 p-4 rounded-lg space-y-3">
                      <h5 className="font-semibold text-lg">
                        Banco de preguntas: <span className="text-primary">{bank.name}</span>
                      </h5>
                      <div className="space-y-2">
                        {bank.questions?.map((question) => (
                          <div key={question.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
                            <span className="text-primary font-medium">{question.title}</span>
                            <span className="text-secondary italic">{question.type}</span>
                          </div>
                        ))}
                      </div>
                      
                      {bank.followUp && (
                        <p className="text-sm text-gray-400">
                          Seguimiento: {bank.followUp.enabled ? 
                            `Días: ${bank.followUp.daysOfWeek.join(', ')} Hora: ${bank.followUp.time}` : 
                            bank.followUp.oneTime ? 
                              `Único: ${bank.followUp.oneTimeDate} ${bank.followUp.oneTimeTime}` : 
                              'No seguimiento'}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className='flex justify-center gap-2 mt-4'>
                    <button 
                      className='btn btn-secondary' 
                      onClick={() => router.push(`/pacientes/${id}/editarFormula/${formula._id}`)}
                    >
                      Editar fórmula
                    </button>
                    <button 
                      className='btn btn-error' 
                      onClick={() => openConfirmationModal(formula._id || '')}
                    >
                      Eliminar fórmula
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {patient.asignedFormulas.length === 0 && 
            <p className='text-center'>No hay formulas asignadas</p>
          }
          <button 
            className='btn btn-success' 
            onClick={() => router.push(`/pacientes/${id}/asignarFormula`)}
          >
            Asignar formula
          </button>
        </div>
      </div>
      
      <ModalAcceptDelete 
        isOpen={isModalOpen}
        title="Eliminar Fórmula"
        message="¿Está seguro que desea eliminar esta fórmula? Esta acción no se puede deshacer."
        onAccept={() => {
          closeConfirmationModal();
          handleDeleteFormula(selectedFormulaId);
        }}
        onClose={closeConfirmationModal}
      />
    </div>
  )
}


export default page