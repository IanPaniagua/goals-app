'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/types';
import { getGoals, deleteGoal } from '@/lib/firebase-service';
import { AREAS } from '@/lib/constants';
import { PlusCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/auth');
      return;
    }

    if (user) {
      const loadGoals = async () => {
        try {
          const userGoals = await getGoals();
          setGoals(userGoals);
        } catch (error) {
          console.error('Error loading goals:', error);
        }
      };
      loadGoals();
    }
  }, [user, authLoading]);

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Panel de Control
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/goals/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Nueva Meta
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Areas Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Áreas de Enfoque</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {AREAS.map((area) => (
              <Link
                key={area.id}
                href={`/goals/new?area=${area.id}`}
                className={`${area.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center`}
              >
                <div className="text-2xl mb-2">{area.icon}</div>
                <div className="font-semibold">{area.displayName}</div>
                <div className="text-sm opacity-90">
                  {goals.filter(goal => goal.area.includes(area.id)).length} metas
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <PlusCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No tienes metas aún</h3>
              <p className="text-gray-400 mb-6">
                Comienza creando tu primera meta personal en cualquiera de las áreas de arriba
              </p>
              <Link
                href="/goals/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Crear Primera Meta
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const goalAreas = AREAS.filter(a => goal.area.includes(a.id));
              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{borderLeftColor: goalAreas[0]?.color.replace('bg-', '#')}}>
                  {goal.imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={goal.imageUrl}
                        alt="Imagen de la meta"
                        className="h-32 w-auto rounded-lg object-cover border"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {goalAreas.map(area => (
                      <span key={area.id} className={`${area.color} text-white px-2 py-1 rounded text-sm flex items-center gap-1`}>
                        <span>{area.icon}</span>
                        {area.displayName}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/goals/${goal.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center"
                    >
                      Ver Detalles
                    </Link>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 