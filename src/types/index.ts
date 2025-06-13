export interface Goal {
  id: string;
  title: string;
  description: string;
  area: Area[];
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  expectedAmount?: number;
  actualAmount?: number;
  imageUrl?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Area = 'riqueza' | 'salud' | 'relaciones' | 'alma' | 'personal';

export interface GoalFormData {
  title: string;
  description: string;
  area: Area[];
  startDate: string;
  expectedCompletionDate: string;
  expectedAmount?: number;
  image?: FileList;
} 