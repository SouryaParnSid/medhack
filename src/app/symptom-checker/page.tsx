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
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl slide-up">
              <span className="gradient-text">Symptom</span> Checker
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Describe the symptoms you're observing, and our AI will help analyze them with high accuracy.
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 overflow-hidden glass">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h2 className="text-white font-medium">Symptom Analysis</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter your symptoms below in as much detail as possible. Include when they started, their severity, and any other relevant information.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-lg shadow-sm">
                  <div className="relative">
                    <textarea
                      rows={4}
                      name="symptoms"
                      id="symptoms"
                      className="block w-full rounded-lg border-0 py-4 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors sm:text-sm sm:leading-6"
                      placeholder="Describe the symptoms here..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`absolute bottom-2 right-14 p-2 rounded-full transition-colors ${
                        isRecording ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      } hover:bg-gray-200 dark:hover:bg-gray-700`}
                    >
                      <MicrophoneIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !symptoms.trim()}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:scale-105"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => setSymptoms(prev => prev + (prev ? '\n' : '') + "Fever, headache, and sore throat for the past 2 days")}
                    className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    Fever & sore throat
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSymptoms(prev => prev + (prev ? '\n' : '') + "Stomach pain, nausea, and vomiting since yesterday")}
                    className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    Stomach issues
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSymptoms(prev => prev + (prev ? '\n' : '') + "Rash on arms and chest, itchy and red")}
                    className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    Skin rash
                  </button>
                </div>
              </form>
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 text-center fade-in">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-600 dark:border-indigo-400 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing symptoms...</p>
            </div>
          )}

          {result && (
            <div className="mt-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 fade-in">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Analysis Result</h2>
              </div>
              
              <div className="mt-2 prose prose-sm text-gray-600 dark:text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
              
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors hover:scale-105"
                >
                  Save to Records
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Share with Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="rounded-md bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  New Analysis
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This analysis is provided for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          )}
          
          {!result && !isLoading && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">AI-Powered Analysis</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Our advanced AI analyzes symptoms using the latest medical knowledge.</p>
              </div>
              
              <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Severity Assessment</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Get an assessment of symptom severity and urgency level.</p>
              </div>
              
              <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Detailed Reports</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Save and share comprehensive symptom analysis reports.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}