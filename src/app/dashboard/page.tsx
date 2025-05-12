'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { Formula } from '@/types/models';
import { formulaService } from '@/services/api';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const data = await formulaService.getAll();
        setFormulas(data);
      } catch (error) {
        console.error('Error al cargar fórmulas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulas();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Bienvenido, {user?.name}
            </h1>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {formulas.map((formula) => (
                  <div
                    key={formula.id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {formula.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formula.description}
                      </p>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                          {formula.dosis}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <a
                          href={`/formulas/${formula.id}`}
                          className="font-medium text-primary hover:text-primary-dark"
                        >
                          Ver detalles
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 