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

  // Function to extract the actual priority from the analysis HTML
  const extractPriorityFromAnalysis = (analysisHtml: string): 'high' | 'medium' | 'low' => {
    // Extract priority from the analysis text using the same regex as in gemini.ts
    const priorityMatch = analysisHtml?.match(/Priority Level: <strong[^>]*>(HIGH|MEDIUM|LOW)<\/strong>/i);
    return priorityMatch ? priorityMatch[1].toLowerCase() as 'high' | 'medium' | 'low' : 'medium';
  };

  const loadPatients = async () => {
    try {
      const dbPatients = await firebaseDb.getPatients();
      
      // Process each patient to ensure priority is consistent with analysis
      const processedPatients = dbPatients.map(patient => {
        if (patient.analysis) {
          // Extract priority from analysis HTML
          const analysisBasedPriority = extractPriorityFromAnalysis(patient.analysis);
          
          // If the stored priority doesn't match the one in the analysis, update it
          if (patient.priority !== analysisBasedPriority) {
            console.log(`Fixing priority mismatch for patient ${patient.name}: ${patient.priority} -> ${analysisBasedPriority}`);
            // Update the patient object with the correct priority
            if (patient.id) {
              firebaseDb.updatePatient(patient.id, { priority: analysisBasedPriority });
            }
            return { ...patient, priority: analysisBasedPriority };
          }
        }
        return patient;
      });
      
      // Sort patients by priority (high -> medium -> low)
      const sortedPatients = processedPatients.sort((a, b) => {
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
      const priorityMatch = result.analysis?.match(/Priority Level: <strong[^>]*>(HIGH|MEDIUM|LOW)<\/strong>/i);
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
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-12 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-8 md:py-16 lg:py-24">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl slide-up">
              <span className="gradient-text">Triage</span> Assistant
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Prioritize patients based on symptom severity and manage your waiting list efficiently.
            </p>
          </div>
          
          <DataMigrationBanner />

          <div className="mt-6 md:mt-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 overflow-hidden glass">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 md:p-4 flex items-center">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-2 md:mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h2 className="text-white text-sm md:text-base font-medium">Patient Registration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
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

          <div className="mt-8 md:mt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-0">Patient Queue</h2>
              <div className="flex flex-wrap gap-2 md:gap-0 md:space-x-2">
                <span className="inline-flex items-center rounded-full px-2 md:px-2.5 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-red-500"></span>
                  High
                </span>
                <span className="inline-flex items-center rounded-full px-2 md:px-2.5 py-0.5 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500"></span>
                  Medium
                </span>
                <span className="inline-flex items-center rounded-full px-2 md:px-2.5 py-0.5 text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                  Low
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3 md:gap-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-lg bg-white dark:bg-gray-800/90 p-3 md:p-4 shadow-md dark:shadow-indigo-900/20 border border-gray-200 dark:border-gray-700/50 transition-all hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/50 fade-in relative group overflow-hidden"
                >
                  <div className="flex items-start gap-2">
                    {/* Patient info with avatar */}
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/30 flex-shrink-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">{patient.name}</h3>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md">{patient.age} yrs</span>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(patient.priority)}`}>
                          {patient.priority === 'high' && <ExclamationTriangleIcon className="inline-block h-3 w-3 mr-1" />}
                          {patient.priority === 'medium' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block h-3 w-3 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                          )}
                          {patient.priority === 'low' && <CheckCircleIcon className="inline-block h-3 w-3 mr-1" />}
                          {patient.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <details className="text-xs md:text-sm mb-0.5 group/details">
                          <summary className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center bg-gray-50 dark:bg-gray-700/30 px-2 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                            </svg>
                            <span>Symptoms</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-auto transition-transform group-open/details:rotate-180">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </summary>
                          <div className="mt-1.5 px-2 py-1.5 bg-gray-50/50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700/50">
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{patient.symptoms}</p>
                          </div>
                        </details>
                        
                        {patient.analysis && (
                          <details className="text-xs md:text-sm mb-0.5 group/details mt-1.5">
                            <summary className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center bg-gray-50 dark:bg-gray-700/30 px-2 py-1 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                              </svg>
                              <span>Analysis</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-auto transition-transform group-open/details:rotate-180">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </summary>
                            <div className="mt-1.5 bg-gray-50/50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                              <div 
                                className="text-xs text-gray-600 dark:text-gray-300 prose prose-xs dark:prose-invert max-h-36 overflow-y-auto prose-p:my-1 prose-li:my-0.5 prose-ul:my-1 prose-headings:mb-1" 
                                dangerouslySetInnerHTML={{ 
                                  __html: patient.analysis
                                    .replace(/\n/g, '<br />')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                }} 
                              />
                            </div>
                          </details>
                        )}
                        
                        <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/30">
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1 text-gray-400 dark:text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {patient.timestamp.toDate().toLocaleDateString()} {patient.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDelete(patient.id!)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                              aria-label="Remove patient"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                            <button 
                              className="text-gray-400 hover:text-indigo-500 transition-colors p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
                              aria-label="View details"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {patients.length === 0 && (
                <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No patients in queue</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Add a patient using the form above to begin triage</p>
                </div>
              )}
            </div>
            
            {patients.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
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