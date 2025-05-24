'use client'

import User from '@/app/interfaces/User.interface'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useFormulaStore from '@/store/formulaStore'
import Formula, { Question } from '@/app/interfaces/Formula.interface'
import { MdDelete } from 'react-icons/md'
import NavBar from '@/components/NavBar'


type Patient = Omit<User, 'id' | 'token'> & {
  _id: string
}

const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
]

interface Question {
  id: number;
  title: string;
  type: string;
  options: Array<{
    id: number;
    text: string;
  }>;
}

interface Bank {
  _id: string;
  name: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

const page = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [patient, setPatient] = useState<Patient | null>(null)
  const [formulaData, setFormulaData] = useState({
    name: '',
    description: '',
    dosis: '',
    followUp: {
      enabled: false,
      daysOfWeek: [] as string[],
      time: '12:00',
      oneTime: false,
      oneTimeDate: '',
      oneTimeTime: '12:00'
    }
  })
  
  const [questionBanks, setQuestionBanks] = useState<any[]>([])
  const [allBanks, setAllBanks] = useState<Bank[]>([])
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedBankId, setSelectedBankId] = useState('')
  const [bankFollowUp, setBankFollowUp] = useState({
    enabled: false,
    daysOfWeek: [] as string[],
    time: '12:00',
    oneTime: false,
    oneTimeDate: '',
    oneTimeTime: '12:00',
    noSend: false
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
      user: id as string,
      questionBanks: questionBanks
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formulas/${id}`, {
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

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('/api/banco-preguntas');
        if (!res.ok) throw new Error('No se pudo obtener bancos');
        const data = await res.json();
        setAllBanks(data);
      } catch {
        setAllBanks([]);
      }
    };
    fetchBanks();
  }, []);

  const handleAddBank = () => {
    setShowBankModal(true);
    setSelectedBankId('');
    setBankFollowUp({
      enabled: false,
      daysOfWeek: [],
      time: '12:00',
      oneTime: false,
      oneTimeDate: '',
      oneTimeTime: '12:00',
      noSend: false
    });
  };

  const handleConfirmAddBank = () => {
    if (!selectedBankId) {
      toast.error('Debes seleccionar un banco de preguntas');
      return;
    }
    setQuestionBanks(prev => [...prev, { bankId: selectedBankId, followUp: { ...bankFollowUp } }]);
    setShowBankModal(false);
  };

  const handleDeleteBank = (index: number) => {
    setQuestionBanks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='bg-base-200 gap-8 py-20 w-full min-h-screen'>
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

          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Bancos de preguntas agregados</h2>
              <button type='button' className='btn btn-info' onClick={handleAddBank}>Agregar banco de preguntas</button>
            </div>
            {questionBanks.length === 0 && <div className='text-sm text-gray-400'>No hay bancos de preguntas agregados.</div>}
            <div className='space-y-2'>
              {questionBanks.map((bank, idx) => {
                const bankData = allBanks.find(b => b._id === bank.bankId);
                return (
                  <div key={bank.bankId + idx} className='card bg-base-200 p-4 space-y-4'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <span className='font-semibold'>{bankData?.name || 'Banco eliminado'}</span>
                        <span className='ml-2 text-xs'>Seguimiento: {bank.followUp.enabled ? `Días: ${bank.followUp.daysOfWeek.join(', ')} Hora: ${bank.followUp.time}` : bank.followUp.oneTime ? `Único: ${bank.followUp.oneTimeDate} ${bank.followUp.oneTimeTime}` : 'No seguimiento'}</span>
                      </div>
                      <button type='button' className='btn btn-error btn-xs' onClick={() => handleDeleteBank(idx)}><MdDelete /></button>
                    </div>
                    
                    <div className="bg-base-100 rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2">Preguntas del banco:</h4>
                      <div className="space-y-1">
                        {bankData?.questions.map((question) => (
                          <div key={question.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
                            <span className="text-primary font-medium">{question.title}</span>
                            <span className="text-secondary italic">{question.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
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
      {showBankModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <div className='card bg-base-100 p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Agregar banco de preguntas</h2>
            <div className='mb-4'>
              <label className='label'>Selecciona un banco</label>
              <select
                className='select select-bordered w-full'
                value={selectedBankId}
                onChange={e => setSelectedBankId(e.target.value)}
              >
                <option value=''>Selecciona...</option>
                {allBanks.length === 0 && <option disabled>No hay bancos disponibles</option>}
                {allBanks.map(bank => (
                  <option key={bank._id} value={bank._id}>{bank.name}</option>
                ))}
              </select>
              
              {selectedBankId && (
                <div className="mt-4 bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-2">Preguntas del banco:</h4>
                  <div className="space-y-2">
                    {allBanks.find(bank => bank._id === selectedBankId)?.questions.map((question) => (
                      <div key={question.id} className="flex justify-between items-center p-2 bg-base-100 rounded">
                        <span className="text-primary font-medium">{question.title}</span>
                        <span className="text-secondary italic">{question.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className='divider'></div>
            <h3 className='text-lg font-semibold mb-2'>Configuración de seguimiento</h3>
            <div className='form-control mb-2'>
              <label className='label cursor-pointer justify-start gap-4'>
                <span className='label-text text-lg'>¿No enviar seguimiento?</span>
                <input
                  type='checkbox'
                  className='toggle toggle-primary toggle-lg'
                  checked={bankFollowUp.noSend}
                  onChange={e => setBankFollowUp(f => ({ ...f, noSend: e.target.checked, enabled: false, oneTime: false, daysOfWeek: [], time: '12:00', oneTimeDate: '', oneTimeTime: '12:00' }))}
                />
              </label>
            </div>
            {!bankFollowUp.noSend && (
              <>
                <div className='form-control mb-2'>
                  <label className='label cursor-pointer justify-start gap-4'>
                    <span className='label-text text-lg'>¿El usuario recibirá mensajes de seguimiento?</span>
                    <input
                      type='checkbox'
                      className='toggle toggle-primary toggle-lg'
                      checked={bankFollowUp.enabled}
                      onChange={e => setBankFollowUp(f => ({ ...f, enabled: e.target.checked, oneTime: false }))}
                    />
                  </label>
                </div>
                {bankFollowUp.enabled && (
                  <>
                    <div className='form-control mb-2'>
                      <label className='label'>
                        <span className='label-text text-lg'>Días de la semana</span>
                      </label>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                        {DAYS_OF_WEEK.map(day => (
                          <label key={day} className='label cursor-pointer justify-start gap-2 bg-base-200 p-2 rounded-lg hover:bg-base-300'>
                            <input
                              type='checkbox'
                              className='checkbox checkbox-primary'
                              checked={bankFollowUp.daysOfWeek.includes(day)}
                              onChange={() => setBankFollowUp(f => ({ ...f, daysOfWeek: f.daysOfWeek.includes(day) ? f.daysOfWeek.filter(d => d !== day) : [...f.daysOfWeek, day] }))}
                            />
                            <span className='label-text'>{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className='form-control mb-2'>
                      <label className='label'>
                        <span className='label-text text-lg'>Hora de envío</span>
                      </label>
                      <input
                        type='time'
                        className='input input-bordered w-full max-w-xs'
                        value={bankFollowUp.time}
                        onChange={e => setBankFollowUp(f => ({ ...f, time: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                <div className='form-control mb-2'>
                  <label className='label cursor-pointer justify-start gap-4'>
                    <span className='label-text text-lg'>¿Solo se enviará una vez?</span>
                    <input
                      type='checkbox'
                      className='toggle toggle-primary toggle-lg'
                      checked={bankFollowUp.oneTime}
                      onChange={e => setBankFollowUp(f => ({ ...f, oneTime: e.target.checked, enabled: false }))}
                    />
                  </label>
                </div>
                {bankFollowUp.oneTime && (
                  <>
                    <div className='form-control mb-2'>
                      <label className='label'>
                        <span className='label-text text-lg'>Fecha de envío</span>
                      </label>
                      <input
                        type='date'
                        className='input input-bordered w-full max-w-xs'
                        min={new Date().toISOString().split('T')[0]}
                        value={bankFollowUp.oneTimeDate}
                        onChange={e => setBankFollowUp(f => ({ ...f, oneTimeDate: e.target.value }))}
                      />
                    </div>
                    <div className='form-control mb-2'>
                      <label className='label'>
                        <span className='label-text text-lg'>Hora de envío</span>
                      </label>
                      <input
                        type='time'
                        className='input input-bordered w-full max-w-xs'
                        value={bankFollowUp.oneTimeTime}
                        onChange={e => setBankFollowUp(f => ({ ...f, oneTimeTime: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <div className='flex justify-end gap-2 mt-4'>
              <button className='btn btn-ghost' onClick={() => setShowBankModal(false)}>Cancelar</button>
              <button className='btn btn-primary' onClick={handleConfirmAddBank}>Agregar banco</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default page