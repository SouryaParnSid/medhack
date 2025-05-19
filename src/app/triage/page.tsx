'use client';

import { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { analyzeTriage } from '@/utils/gemini';
import { firebaseDb, FirebasePatient } from '@/lib/firebaseDb';
import DataMigrationBanner from '@/components/DataMigrationBanner';

export default function Triage() {
  const [patients, setPatients] = useState<FirebasePatient[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const dbPatients = await firebaseDb.getPatients();
      // Sort patients by priority (high -> medium -> low)
      const sortedPatients = dbPatients.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      setPatients(sortedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this patient from the queue?')) {
      try {
        await firebaseDb.deletePatient(id);
        await loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await analyzeTriage({
        name: formData.name,
        age: parseInt(formData.age),
        symptoms: formData.symptoms,
      });
      
      // Extract priority from the analysis text
      const priorityMatch = result.analysis?.match(/Priority Level: \*\*(High|Medium|Low)\*\*/i);
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() as 'high' | 'medium' | 'low' : 'medium';
      
      const newPatient = {
        name: formData.name,
        age: parseInt(formData.age),
        symptoms: formData.symptoms,
        priority,
        analysis: result.analysis
      };

      await firebaseDb.addPatient(newPatient);
      await loadPatients(); // This will load the sorted list from the database

      setFormData({ name: '', age: '', symptoms: '' });
    } catch (error) {
      console.error('Error analyzing triage priority:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/30';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900/30';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl slide-up">
              <span className="gradient-text">Triage</span> Assistant
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Add patient details for AI-powered triage assessment and prioritization based on severity.
            </p>
          </div>
          
          <DataMigrationBanner />

          <div className="mt-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 overflow-hidden glass">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h2 className="text-white font-medium">Patient Registration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors sm:text-sm sm:leading-6"
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors sm:text-sm sm:leading-6"
                    placeholder="Enter age"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Symptoms
                  </label>
                  <textarea
                    id="symptoms"
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors sm:text-sm sm:leading-6"
                    placeholder="Describe the patient's symptoms in detail..."
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:scale-105"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Queue</h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-red-500"></span>
                  High Priority
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500"></span>
                  Medium Priority
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                  Low Priority
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg fade-in relative group"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">{patient.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Age: {patient.age}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pl-13">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Symptoms:</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{patient.symptoms}</p>
                        
                        {patient.analysis && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis:</h4>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: patient.analysis.replace(/\n/g, '<br />') }} />
                          </div>
                        )}
                        
                        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                          Added: {patient.timestamp.toDate().toLocaleTimeString()} | {patient.timestamp.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full px-3 py-1.5 text-xs font-medium ${getPriorityBadgeClass(patient.priority)}`}>
                        {patient.priority === 'high' && <ExclamationTriangleIcon className="inline-block h-4 w-4 mr-1" />}
                        {patient.priority === 'medium' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block h-4 w-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                        )}
                        {patient.priority === 'low' && <CheckCircleIcon className="inline-block h-4 w-4 mr-1" />}
                        {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)} Priority
                      </div>
                      <button
                        onClick={() => handleDelete(patient.id!)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-red-600 dark:text-red-400"
                        title="Remove patient from queue"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {patients.length === 0 && (
                <div className="rounded-xl bg-white dark:bg-gray-800 p-8 shadow-md dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">No patients in queue</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Add a patient using the form above to begin triage</p>
                </div>
              )}
            </div>
            
            {patients.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Patients are automatically sorted by priority level. High priority patients should be attended to first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}