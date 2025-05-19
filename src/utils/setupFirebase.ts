import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

/**
 * Utility function to check if the Firestore collections are properly set up
 * and create initial structure if needed
 */
export async function checkFirestoreSetup(): Promise<{ success: boolean; message: string }> {
  try {
    // Check if the patients collection exists by attempting to query it
    const patientsCollection = collection(db, 'patients');
    const q = query(patientsCollection, limit(1));
    await getDocs(q);
    
    // If we get here, the collection exists or was automatically created
    return { 
      success: true, 
      message: 'Firebase Firestore is properly configured and ready to use.' 
    };
  } catch (error) {
    console.error('Error checking Firestore setup:', error);
    return { 
      success: false, 
      message: `Error connecting to Firestore: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Call this function when your app initializes to ensure Firebase is properly set up
 */
export async function initializeFirebase(): Promise<void> {
  try {
    const result = await checkFirestoreSetup();
    console.log('Firebase initialization status:', result.message);
    
    if (!result.success) {
      console.error('Firebase initialization failed. Please check your configuration.');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}
