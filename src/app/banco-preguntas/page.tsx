'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalAcceptDelete from '@/components/ModalAcceptDelete';

interface Question {
  id: number;
  title: string;
  type: string;
  options: { id: number; text: string }[];
}

interface QuestionBank {
  _id: string;
  name: string;
  questions: Question[];
}

const BancoPreguntasPage = () => {
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('/api/banco-preguntas');
        if (!res.ok) throw new Error('No se pudo obtener el banco de preguntas');
        const data = await res.json();
        setBanks(data);
        setError('');
      } catch (err) {
        setBanks([]);
        setError('No hay bancos de preguntas creados aún.');
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleDelete = async (id: string) => {
    setBankToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!bankToDelete) return;
    try {
      const res = await fetch(`/api/banco-preguntas/${bankToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Banco eliminado correctamente');
      setBanks(prev => prev.filter(b => b._id !== bankToDelete));
    } catch (err) {
      toast.error('Error al eliminar el banco de preguntas');
    } finally {
      setModalOpen(false);
      setBankToDelete(null);
    }
  };

  return (
    <div className="bg-base-200 p-8 flex flex-col justify-center">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banco de preguntas</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/banco-preguntas/crear')}
        >
          + Agregar nuevo banco de preguntas
        </button>
      </div>
      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : error ? (
        <div className="text-center mt-10">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank) => (
            <div key={bank._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{bank.name}</h2>
                <ul className="list-disc ml-5 mb-4">
                  {bank.questions.map((q) => (
                    <li key={q.id} className="text-base-content/80 mb-2">
                      <span className="font-semibold">{q.title}</span> <span className="text-xs">({q.type})</span>
                      {q.options.length > 0 && <span className="ml-2 text-xs">• {q.options.length} opciones</span>}
                      {(q.type === 'multiple' || q.type === 'unica') && q.options.length > 0 && (
                        <ul className="ml-4 mt-1 text-xs text-base-content/80">
                          {q.options.map(opt => (
                            <li key={opt.id}>{opt.text}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="card-actions justify-end gap-2">
                  <button className="btn btn-warning btn-sm" onClick={() => router.push(`/banco-preguntas/editar/${bank._id}`)}>Editar</button>
                  <button className="btn btn-error btn-sm" onClick={() => handleDelete(bank._id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ModalAcceptDelete
        isOpen={modalOpen}
        title="Eliminar banco de preguntas"
        message="¿Estás seguro de que deseas eliminar este banco de preguntas? Esta acción no se puede deshacer."
        onAccept={confirmDelete}
        onClose={() => { setModalOpen(false); setBankToDelete(null); }}
      />
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default BancoPreguntasPage; 