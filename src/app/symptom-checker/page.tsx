'use client';

import { useState } from 'react';
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { analyzeSymptoms } from '@/utils/gemini';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const analysis = await analyzeSymptoms(symptoms);
      setResult(analysis);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setResult('Sorry, there was an error analyzing the symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Here we'll implement voice recording functionality
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Symptom Checker
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Describe the symptoms you're observing, and our AI will help analyze them.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-lg shadow-sm">
              <div className="relative">
                <textarea
                  rows={4}
                  name="symptoms"
                  id="symptoms"
                  className="block w-full rounded-lg border-0 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Describe the symptoms here..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute bottom-2 right-14 p-2 rounded-full ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  } hover:bg-gray-200`}
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !symptoms}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-medium text-gray-900">Analysis Result</h2>
              <div className="mt-2 prose prose-sm text-gray-600" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save to Records
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Share with Doctor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 