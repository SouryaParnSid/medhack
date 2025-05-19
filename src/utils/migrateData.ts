import { db } from '@/lib/db';
import { firebaseDb } from '@/lib/firebaseDb';

/**
 * Utility function to migrate data from local IndexedDB to Firebase Firestore
 * This helps users transition from the offline-only version to the online database
 */
export async function migrateLocalDataToFirebase(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    // Get all patients from local database
    const localPatients = await db.getPatients();
    
    if (localPatients.length === 0) {
      return { success: true, count: 0 };
    }
    
    // Track successful migrations
    let migratedCount = 0;
    
    // Migrate each patient to Firebase
    for (const patient of localPatients) {
      // Destructure and ignore the id as we'll get a new one from Firebase
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...patientData } = patient;
      
      // Prepare data for Firebase
      const firestorePatient = {
        ...patientData,
        // Remove timestamp as it will be added by the firebaseDb.addPatient method
      };
      
      // Add to Firebase
      await firebaseDb.addPatient(firestorePatient);
      migratedCount++;
    }
    
    return { success: true, count: migratedCount };
  } catch (error) {
    console.error('Error migrating data to Firebase:', error);
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error during migration' 
    };
  }
}

/**
 * Check if there's local data that needs migration
 */
export async function checkForLocalData(): Promise<number> {
  try {
    const localPatients = await db.getPatients();
    return localPatients.length;
  } catch (error) {
    console.error('Error checking for local data:', error);
    return 0;
  }
}
