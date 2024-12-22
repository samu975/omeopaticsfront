'use client';
import Paciente from '@/app/interfaces/Paciente.interface';
import useAdminStore from '@/store/adminStore';
import useUIStore from '@/store/uiStore';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ModalAddFormula from './ModalAddFormula';
import { useRouter } from 'next/navigation';
import Formula from '@/app/interfaces/Formula.interface';

const page = () => {
  const { pacientes } = useAdminStore();
  const router = useRouter();
  const params = useParams();
  const [paciente, setPaciente] = useState<Paciente>({
    id: 0,
    nombre: '',
    telefono: '',
    asignedFormulas: [],
  });
  const { isModalOpen, setIsModalOpen } = useUIStore();

  useEffect(() => {
    const id = params.id;
    const foundPaciente = pacientes.find((paciente) => paciente.id === Number(id));
    setPaciente(foundPaciente || { id: 0, nombre: '', telefono: '', asignedFormulas: [] });
  }, [pacientes, params.id]);

  const handleEditFormula = (formula: Formula) => {
    router.push(`/formula/editarFormula/${formula.id}`);
  }

  const handleSeguimiento = (formula: Formula) => {
    router.push(`/formula/seguirFormula/${formula.id}`);
  }

  return (
    <main className="h-screen bg-base-200 pt-20 px-10">
      <h1 className="font-bold text-3xl text-white">Agregar formula</h1>
      <div className="mt-8">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="nombre"
            className="font-bold text-xl uppercase text-white"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            className="input input-bordered"
            value={paciente.nombre}
            onChange={(e) => setPaciente({ ...paciente, nombre: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-4 my-6">
          <label
            htmlFor="telefono"
            className="font-bold text-xl uppercase text-white"
          >
            Telefono
          </label>
          <input
            type="text"
            id="telefono"
            className="input input-bordered"
            value={paciente.telefono}
            onChange={(e) => setPaciente({ ...paciente, telefono: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-4 mt-16">
          <label
            htmlFor="medicamentos"
            className="font-bold text-xl uppercase text-white"
          >
            Formulas
          </label>
          <div className="my-4">
            <button
              className="btn btn-success"
              onClick={() => setIsModalOpen(true)}
            >
              Agregar formula
            </button>
          </div>
          {isModalOpen && <ModalAddFormula />}
          <ul className="flex flex-col gap-4 bg-base-300 p-4 rounded-lg">
            {paciente.asignedFormulas.map((formula) => (
              <li
                key={formula.id}
                className="flex flex-col gap-4 items-center font-bold text-xl"
              >
                {formula.name}
                <div className="flex gap-4">
                  <button className="btn btn-primary" onClick={() => handleEditFormula(formula)}>Editar formula</button>
                  <button className="btn btn-secondary" onClick={() => handleSeguimiento(formula)}>Seguimiento</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default page;
