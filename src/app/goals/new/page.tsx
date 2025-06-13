'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { GoalFormData, Area } from '@/types';
import { AREAS } from '@/lib/constants';
import { createGoal, uploadImage } from '@/lib/firebase-service';
import { Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewGoal() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    area: [],
    startDate: '',
    expectedCompletionDate: '',
    expectedAmount: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [showAreaWarning, setShowAreaWarning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.area.length === 0) {
      setShowAreaWarning(true);
      setLoading(false);
      return;
    } else {
      setShowAreaWarning(false);
    }

    try {
      let imageUrl: string | undefined = undefined;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }
      const goalData = { ...formData, imageUrl };
      await createGoal(goalData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Error al crear la meta. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'area' && e.target instanceof HTMLInputElement) {
      setFormData(prev => {
        let newAreas = prev.area || [];
        if ((e.target as HTMLInputElement).checked) {
          newAreas = [...newAreas, value as Area];
        } else {
          newAreas = newAreas.filter(a => a !== value);
        }
        return { ...prev, area: newAreas };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'expectedAmount' ? (value ? parseFloat(value) : undefined) : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Nueva Meta Personal
            </h1>
            <p className="text-gray-600 mb-8">
              Define tu nueva meta y comienza tu viaje hacia el éxito
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Meta *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-700"
                  placeholder="Ej: Ahorrar $10,000 para emergencias"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-700"
                  placeholder="Describe tu meta y por qué es importante para ti..."
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área de Vida *
                </label>
                <div className="flex flex-wrap gap-4">
                  {AREAS.map((area) => (
                    <label key={area.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="area"
                        value={area.id}
                        checked={formData.area.includes(area.id)}
                        onChange={handleInputChange}
                        className="accent-blue-600"
                      />
                      <span>{area.icon} {area.name}</span>
                    </label>
                  ))}
                </div>
                {showAreaWarning && (
                  <p className="text-red-500 text-xs mt-1">Selecciona al menos un área.</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Objetivo *
                  </label>
                  <input
                    type="date"
                    name="expectedCompletionDate"
                    value={formData.expectedCompletionDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  />
                </div>
              </div>

              {/* Expected Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad Objetivo (opcional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="expectedAmount"
                    value={formData.expectedAmount || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-700 pr-12"
                    placeholder="Ej: 10000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">€</span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen Inspiracional (opcional)
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    Arrastra una imagen aquí
                  </p>
                  {imagePreview && (
                    <div className="mt-4 flex justify-center relative group">
                      <img
                        src={imagePreview}
                        alt="Previsualización"
                        className="h-32 w-auto rounded-lg object-cover border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                        >
                          Cambiar
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Seleccionar Archivo
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg text-center hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 