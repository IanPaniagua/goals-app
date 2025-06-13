import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import { Goal, GoalFormData } from '../types';

// Helper function to get current user ID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }
  return user.uid;
};

// Goals operations
export const createGoal = async (goalData: GoalFormData & { imageUrl?: string }): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    const docRef = await addDoc(collection(db, 'goals'), {
      title: goalData.title,
      description: goalData.description,
      area: goalData.area,
      userId,
      startDate: Timestamp.fromDate(new Date(goalData.startDate)),
      expectedCompletionDate: Timestamp.fromDate(new Date(goalData.expectedCompletionDate)),
      actualCompletionDate: null,
      expectedAmount: goalData.expectedAmount || null,
      actualAmount: null,
      imageUrl: goalData.imageUrl || null,
      completed: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const userId = getCurrentUserId();
    // Simple query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'goals'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const goals = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        area: data.area,
        startDate: data.startDate.toDate(),
        expectedCompletionDate: data.expectedCompletionDate.toDate(),
        actualCompletionDate: data.actualCompletionDate ? data.actualCompletionDate.toDate() : undefined,
        expectedAmount: data.expectedAmount,
        actualAmount: data.actualAmount,
        imageUrl: data.imageUrl,
        completed: data.completed,
        userId: data.userId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Goal;
    });
    
    // Sort in JavaScript by creation date (newest first)
    return goals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting goals:', error);
    // If authentication error, return empty array
    if (error instanceof Error && error.message === 'Usuario no autenticado') {
      return [];
    }
    throw error;
  }
};

export const getGoal = async (id: string): Promise<Goal | null> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'goals', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Verify that the goal belongs to the current user
      if (data.userId !== userId) {
        return null;
      }
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        area: data.area,
        startDate: data.startDate.toDate(),
        expectedCompletionDate: data.expectedCompletionDate.toDate(),
        actualCompletionDate: data.actualCompletionDate ? data.actualCompletionDate.toDate() : undefined,
        expectedAmount: data.expectedAmount,
        actualAmount: data.actualAmount,
        imageUrl: data.imageUrl,
        completed: data.completed,
        userId: data.userId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Goal;
    }
    return null;
  } catch (error) {
    console.error('Error getting goal:', error);
    return null;
  }
};

export const updateGoal = async (id: string, goalData: Partial<GoalFormData>): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'goals', id);
    
    // Verify that the goal belongs to the user
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Objetivo no encontrado o no tienes permisos');
    }

    const updateData: Record<string, any> = {
      ...goalData,
      updatedAt: Timestamp.now(),
    };

    if (goalData.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(goalData.startDate));
    }
    if (goalData.expectedCompletionDate) {
      updateData.expectedCompletionDate = Timestamp.fromDate(new Date(goalData.expectedCompletionDate));
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (id: string): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'goals', id);
    
    // Verify that the goal belongs to the user
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Objetivo no encontrado o no tienes permisos');
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Image upload
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    const storageRef = ref(storage, `goals/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Export as an object for easier importing
export const goalService = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  uploadImage
}; 