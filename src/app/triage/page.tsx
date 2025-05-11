'use client';

import { useState } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { analyzeTriage } from '@/utils/gemini';

interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  analysis?: string;
}

export default function Triage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { priority, analysis } = await analyzeTriage({
        name: formData.name,
        age: parseInt(formData.age),
        symptoms: formData.symptoms,
      });
      
      const newPatient: Patient = {
        id: Date.now().toString(),
        name: formData.name,
        age: parseInt(formData.age),
        symptoms: formData.symptoms,
        priority,
        analysis,
        timestamp: new Date(),
      };

      setPatients(prev => [...prev, newPatient].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }));

      setFormData({ name: '', age: '', symptoms: '' });
    } catch (error) {
      console.error('Error analyzing triage priority:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Triage Assistant
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Add patient details for AI-powered triage assessment and prioritization.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md bg-white p-6 shadow">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                    Symptoms
                  </label>
                  <textarea
                    id="symptoms"
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Add Patient'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Patient Queue</h2>
            <div className="mt-4 space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-lg bg-white p-6 shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Age: {patient.age}</p>
                      <p className="mt-1 text-sm text-gray-500">{patient.symptoms}</p>
                      {patient.analysis && (
                        <div className="mt-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: patient.analysis.replace(/\n/g, '<br />') }} />
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Added: {patient.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                      {patient.priority === 'high' && <ExclamationTriangleIcon className="inline-block h-4 w-4 mr-1" />}
                      {patient.priority === 'low' && <CheckCircleIcon className="inline-block h-4 w-4 mr-1" />}
                      {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)} Priority
                    </div>
                  </div>
                </div>
              ))}
              {patients.length === 0 && (
                <p className="text-center text-gray-500 py-8">No patients in queue</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 