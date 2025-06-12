import { Area } from '../types';

interface AreaConfig {
  id: Area;
  name: string;
  displayName: string;
  color: string;
  icon: string;
}

export const AREAS: AreaConfig[] = [
  {
    id: 'riqueza',
    name: 'Riqueza',
    displayName: 'Riqueza',
    color: 'bg-emerald-500',
    icon: '💰'
  },
  {
    id: 'salud',
    name: 'Salud',
    displayName: 'Salud',
    color: 'bg-red-500',
    icon: '🏥'
  },
  {
    id: 'relaciones',
    name: 'Relaciones',
    displayName: 'Relaciones',
    color: 'bg-blue-500',
    icon: '❤️'
  },
  {
    id: 'alma',
    name: 'Alma',
    displayName: 'Alma',
    color: 'bg-purple-500',
    icon: '🧘'
  }
];

export const DEFAULT_AREAS = AREAS; 