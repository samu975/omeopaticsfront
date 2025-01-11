'use client';

import Answer from '@/app/interfaces/Answer.interface';
import FollowUp from '@/app/interfaces/FollowUp.interface';
import Formula from '@/app/interfaces/Formula.interface';
import Question from '@/app/interfaces/Question.interface';
import { useParams } from 'next/navigation';
import React from 'react';

const page = () => {
  const { id } = useParams();

  const mockFormulas: Formula[] = [
    {
      id: 1,
      name: 'Formula 1',
      description: 'Formula 1',
      followUps: [
        {
          id: 1,
          answers: [
            {
              id: 1,
              type: 'open',
              answer: 'Respuesta 1',
              question: {
                id: 1,
                title: 'Pregunta 1',
                type: 'open',
              },
            },
            {
              id: 2,
              type: 'multiple',
              answer: ['Opcion 1', 'Opcion 2'],
              question: {
                id: 2,
                title: 'Pregunta 2',
                type: 'multiple',
                options: [
                  {
                    id: 1,
                    value: 'Opcion 1',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className=" h-screen p-4 bg-base-300">
      
      <h2 className="text-2xl font-bold mb-6">Seguimiento de Fórmula</h2>

      <div className="space-y-6">
        {mockFormulas.map((formula) => (
          <div key={formula.id} className="bg-base-200 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">{formula.name}</h3>
            <ul>
              {formula.followUps.map((followUp: FollowUp) => (
                <li key={followUp.id}>
                  {followUp.answers.map((answer: Answer) => (
                    <div key={answer.id} className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">
                        {answer.question.title}
                      </h3>
                      <ul className="pl-5">
                        {answer.question.type === 'open' ? (
                          <li className="text-gray-200">{answer.answer}</li>
                        ) : (
                          answer.question.options?.map((option) => (
                            <li key={option.id} className="mb-2">
                              {option.value}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
