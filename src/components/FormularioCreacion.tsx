import React, { useState } from 'react';

interface Option {
  id: number;
  value: string;
}

interface Question {
  id: number;
  title: string;
  type: 'open' | 'multiple' | 'single';
  options?: Option[];
}

const FormularioCreacion = ({formulaId}: {formulaId: number}) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        title: '',
        type: 'open',
        options: [],
      },
    ]);
  };

  const handleUpdateQuestion = (id: number, key: keyof Question, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, [key]: value } : q
      )
    );
  };

  const handleAddOption = (questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), { id: (q.options?.length || 0) + 1, value: '' }],
            }
          : q
      )
    );
  };

  const handleUpdateOption = (questionId: number, optionId: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((o) => (o.id === optionId ? { ...o, value } : o)),
            }
          : q
      )
    );
  };

  const handleSave = () => {
    // Envviar las preguntas a la base de datos agregando el id de la formula
    console.log(questions);
    console.log(formulaId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Formulario</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={handleAddQuestion}
      >
        Agregar Pregunta
      </button>

      <div className="flex flex-col gap-6">
        {questions.map((question) => (
          <div key={question.id} className="p-4 border rounded-lg">
            <input
              type="text"
              placeholder="Título de la pregunta"
              value={question.title}
              onChange={(e) =>
                handleUpdateQuestion(question.id, 'title', e.target.value)
              }
              className="input input-bordered w-full mb-2"
            />

            <select
              value={question.type}
              onChange={(e) =>
                handleUpdateQuestion(question.id, 'type', e.target.value)
              }
              className="select select-bordered w-full mb-2"
            >
              <option value="open">Pregunta abierta</option>
              <option value="multiple">Selección múltiple</option>
              <option value="single">Selección única</option>
            </select>

            {(question.type === 'multiple' || question.type === 'single') && (
              <div className="pl-4">
                <h3 className="font-bold mb-2">Opciones</h3>
                {question.options?.map((option) => (
                  <div key={option.id} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      placeholder={`Opción ${option.id}`}
                      value={option.value}
                      onChange={(e) =>
                        handleUpdateOption(question.id, option.id, e.target.value)
                      }
                      className="input input-bordered flex-1"
                    />
                  </div>
                ))}
                <button
                  className="btn btn-secondary"
                  onClick={() => handleAddOption(question.id)}
                >
                  Agregar otra opción
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="btn btn-success mt-6"
        onClick={handleSave}
      >
        Guardar Formulario
      </button>
    </div>
  );
};

export default FormularioCreacion;
