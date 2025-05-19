'use client';

import { useState, useEffect } from 'react';
import { migrateLocalDataToFirebase, checkForLocalData } from '@/utils/migrateData';

export default function DataMigrationBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success?: boolean;
    count?: number;
    error?: string;
  }>({});
  const [localDataCount, setLocalDataCount] = useState<number | null>(null);

  // Check for local data when component mounts
  useEffect(() => {
    const checkLocalData = async () => {
      const count = await checkForLocalData();
      setLocalDataCount(count);
    };
    checkLocalData();
  }, []);

  // If no local data or already migrated, don't show the banner
  if (!isVisible || localDataCount === 0 || localDataCount === null) {
    return null;
  }

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateLocalDataToFirebase();
      setMigrationResult(result);
      if (result.success) {
        // Hide banner after successful migration
        setTimeout(() => setIsVisible(false), 5000);
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Online Database Available
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            We&apos;ve detected {localDataCount} patient record(s) in your local database. Would you like to migrate them to the online database?
          </p>
          
          {migrationResult.success && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✅ Successfully migrated {migrationResult.count} patient record(s) to the online database.
            </p>
          )}
          
          {migrationResult.error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              ❌ Error: {migrationResult.error}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!migrationResult.success && (
            <button
              onClick={handleMigration}
              disabled={isMigrating}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMigrating ? 'Migrating...' : 'Migrate Data'}
            </button>
          )}
          
          <button
            onClick={() => setIsVisible(false)}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
