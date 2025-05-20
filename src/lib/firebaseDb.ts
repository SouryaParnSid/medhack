import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, Timestamp, DocumentData } from 'firebase/firestore';

export interface FirebasePatient {
  id?: string;
  name: string;
  age: number;
  symptoms: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Timestamp;
  analysis?: string;
}

const COLLECTION_NAME = 'patients';

export class FirebaseDB {
  async addPatient(patient: Omit<FirebasePatient, 'id' | 'timestamp'>): Promise<string> {
    try {
      // Sanitize HTML in analysis if it exists
      if (patient.analysis) {
        patient.analysis = patient.analysis
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      }
      
      const patientWithTimestamp = {
        ...patient,
        timestamp: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), patientWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error adding patient to Firestore:', error);
      throw error;
    }
  }

  async getPatients(): Promise<FirebasePatient[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<FirebasePatient, 'id'>;
        return {
          id: doc.id,
          ...data
        };
      });
    } catch (error) {
      console.error('Error getting patients from Firestore:', error);
      throw error;
    }
  }

  async getPatientsByPriority(priority: 'high' | 'medium' | 'low'): Promise<FirebasePatient[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('priority', '==', priority),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<FirebasePatient, 'id'>;
        return {
          id: doc.id,
          ...data
        };
      });
    } catch (error) {
      console.error('Error getting patients by priority from Firestore:', error);
      throw error;
    }
  }

  async updatePatient(id: string, updates: Partial<FirebasePatient>): Promise<void> {
    try {
      const patientRef = doc(db, COLLECTION_NAME, id);
      
      // Sanitize HTML in analysis if it exists
      if (updates.analysis) {
        updates.analysis = updates.analysis
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      }
      
      await updateDoc(patientRef, updates as DocumentData);
    } catch (error) {
      console.error('Error updating patient in Firestore:', error);
      throw error;
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting patient from Firestore:', error);
      throw error;
    }
  }
}

export const firebaseDb = new FirebaseDB();
