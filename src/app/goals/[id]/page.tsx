"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getGoal } from "@/lib/firebase-service";
import { AREAS } from "@/lib/constants";
import Link from "next/link";

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }
    if (user && params?.id) {
      getGoal(params.id as string).then((g) => {
        setGoal(g);
        setLoading(false);
      });
    }
  }, [user, authLoading, params, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-xl text-gray-600">Meta no encontrada.</div>
      </div>
    );
  }

  const goalAreas = AREAS.filter((a) => goal.area.includes(a.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">← Volver al Dashboard</Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {goal.imageUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={goal.imageUrl}
                alt="Imagen de la meta"
                className="h-48 w-auto rounded-lg object-cover border"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {goalAreas.map((area) => (
              <span key={area.id} className={`${area.color} text-white px-2 py-1 rounded text-sm flex items-center gap-1`}>
                <span>{area.icon}</span>
                {area.displayName}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{goal.title}</h1>
          <p className="text-gray-700 mb-6">{goal.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <span className="block text-gray-500 text-xs">Fecha de inicio</span>
              <span className="block text-gray-800 font-medium">{goal.startDate?.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs">Fecha objetivo</span>
              <span className="block text-gray-800 font-medium">{goal.expectedCompletionDate?.toLocaleDateString()}</span>
            </div>
            {goal.expectedAmount && (
              <div>
                <span className="block text-gray-500 text-xs">Cantidad objetivo</span>
                <span className="block text-gray-800 font-medium">{goal.expectedAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            )}
            {goal.actualAmount && (
              <div>
                <span className="block text-gray-500 text-xs">Cantidad actual</span>
                <span className="block text-gray-800 font-medium">{goal.actualAmount}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {/* Botón de volver eliminado */}
          </div>
        </div>
      </div>
    </div>
  );
} 