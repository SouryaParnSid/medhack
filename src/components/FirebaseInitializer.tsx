'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/utils/setupFirebase';

export default function FirebaseInitializer() {
  // Using only the setter function since we don't need to track the status in the UI
  const [, setStatus] = useState<{ initialized: boolean; error?: string }>({ initialized: false });

  useEffect(() => {
    const setupFirebase = async () => {
      try {
        await initializeFirebase();
        setStatus({ initialized: true });
        console.log('Firebase initialized successfully');
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setStatus({ 
          initialized: false, 
          error: error instanceof Error ? error.message : 'Unknown error initializing Firebase' 
        });
      }
    };

    setupFirebase();
  }, []);

  // This component doesn't render anything visible
  return null;
}
