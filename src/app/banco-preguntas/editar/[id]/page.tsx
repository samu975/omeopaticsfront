'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MdAdd, MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Question {
  id: number;
  title: string;
  type: 'abierta' | 'multiple' | 'unica';
  options: { id: number; text: string }[];
}

const EditarBancoPreguntas = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 0,
    title: '',
    type: 'abierta',
    options: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const res = await fetch(`/api/banco-preguntas/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener el banco');
        const data = await res.json();
        setName(data.name);
        setQuestions(data.questions || []);
      } catch (err) {
        toast.error('Error al cargar el banco de preguntas');
        router.push('/banco-preguntas');
      }
    };
    if (id) fetchBank();
  }, [id, router]);

  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: questions.length + 1,
      title: '',
      type: 'abierta',
      options: []
    });
    setShowQuestionForm(true);
  };

  const handleQuestionChange = (field: keyof Question, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, { id: prev.options.length + 1, text: '' }]
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? { ...opt, text: value } : opt)
    }));
  };

  const handleDeleteOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion.title) {
      toast.error('El título de la pregunta es obligatorio');
      return;
    }
    if (currentQuestion.type !== 'abierta' && currentQuestion.options.length === 0) {
      toast.error('Debe agregar al menos una opción');
      return;
    }
    setQuestions(prev => [...prev, currentQuestion]);
    setShowQuestionForm(false);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('El nombre del banco es obligatorio');
      return;
    }
    if (questions.length === 0) {
      toast.error('Debe agregar al menos una pregunta');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/banco-preguntas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, questions })
      });
      if (!res.ok) throw new Error('Error al actualizar el banco de preguntas');
      toast.success('Banco de preguntas actualizado correctamente', {
        onClose: () => router.push('/banco-preguntas'),
        autoClose: 1200
      });
    } catch (err) {
      toast.error('Error al actualizar el banco de preguntas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl card bg-base-100 shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Editar banco de preguntas</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Nombre del banco</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Preguntas</h2>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddQuestion}>
                <MdAdd className="mr-1" /> Agregar pregunta
              </button>
            </div>
            {questions.length === 0 && <div className="text-sm text-gray-400">No hay preguntas agregadas.</div>}
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="card bg-base-200 p-3 flex flex-row justify-between items-center">
                  <div>
                    <span className="font-semibold">{q.title}</span> <span className="text-xs">({q.type})</span>
                    {q.options.length > 0 && <span className="ml-2 text-xs">• {q.options.length} opciones</span>}
                    {(q.type === 'multiple' || q.type === 'unica') && q.options.length > 0 && (
                      <ul className="ml-4 mt-1 text-xs text-base-content/80 list-disc">
                        {q.options.map(opt => (
                          <li key={opt.id}>{opt.text}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button type="button" className="btn btn-error btn-xs" onClick={() => handleDeleteQuestion(idx)}><MdDelete /></button>
                </div>
              ))}
            </div>
          </div>

          {showQuestionForm && (
            <div className="card bg-base-200 p-4 space-y-4 mt-4">
              <div>
                <label className="label">Título de la pregunta</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={currentQuestion.title}
                  onChange={e => handleQuestionChange('title', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Tipo de pregunta</label>
                <select
                  className="select select-bordered w-full"
                  value={currentQuestion.type}
                  onChange={e => handleQuestionChange('type', e.target.value)}
                >
                  <option value="abierta">Abierta</option>
                  <option value="multiple">Múltiple</option>
                  <option value="unica">Única</option>
                </select>
              </div>
              {currentQuestion.type !== 'abierta' && (
                <div className="space-y-2">
                  <label className="label">Opciones de respuesta</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder={`Opción ${index + 1}`}
                        value={option.text}
                        onChange={e => handleOptionChange(index, e.target.value)}
                      />
                      <button type="button" className="btn btn-error btn-xs" onClick={() => handleDeleteOption(index)}><MdDelete /></button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-xs" onClick={handleAddOption}>
                    <MdAdd className="mr-1" /> Agregar opción
                  </button>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowQuestionForm(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveQuestion}>Guardar pregunta</button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className={`btn btn-success ${loading ? 'loading' : ''}`}>Guardar cambios</button>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default EditarBancoPreguntas; 