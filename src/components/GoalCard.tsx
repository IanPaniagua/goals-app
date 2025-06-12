import React from 'react';
import { Calendar, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Goal, Area } from '../types';

interface GoalCardProps {
  goal: Goal;
  area?: Area;
}

export default function GoalCard({ goal, area }: GoalCardProps) {
  const progressPercentage = goal.actualAmount && goal.expectedAmount 
    ? Math.min((goal.actualAmount / goal.expectedAmount) * 100, 100)
    : 0;

  const isOverdue = !goal.completed && new Date() > goal.expectedEndDate;
  const isCompleted = goal.completed || (goal.actualAmount && goal.actualAmount >= goal.expectedAmount);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gray-200 relative">
        {goal.imageUrl ? (
          <img 
            src={goal.imageUrl} 
            alt={goal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="h-16 w-16" />
          </div>
        )}
        {area && (
          <div className={`absolute top-3 left-3 ${area.color} text-white px-2 py-1 rounded text-sm flex items-center gap-1`}>
            <span>{area.icon}</span>
            {area.displayName}
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm">
            ✓ Completado
          </div>
        )}
        {isOverdue && !isCompleted && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm">
            Vencido
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
        
        {goal.description && (
          <p className="text-gray-600 mb-4 text-sm">{goal.description}</p>
        )}

        {/* Dates */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Inicio: {goal.startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Meta: {goal.expectedEndDate.toLocaleDateString()}</span>
          </div>
          {goal.actualEndDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Realizado: {goal.actualEndDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Amounts */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-1" />
              Meta:
            </span>
            <span className="font-semibold">${goal.expectedAmount.toLocaleString()}</span>
          </div>
          {goal.actualAmount !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                Actual:
              </span>
              <span className="font-semibold">${goal.actualAmount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {goal.expectedAmount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
            onClick={() => window.location.href = `/goals/${goal.id}`}
          >
            Ver detalle
          </button>
          <button 
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-sm"
            onClick={() => window.location.href = `/goals/${goal.id}/edit`}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
} 