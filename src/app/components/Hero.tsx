'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const features = [
  { name: 'AI-Powered', description: 'Advanced machine learning algorithms for accurate diagnosis' },
  { name: 'Offline Mode', description: 'Works without internet for rural healthcare settings' },
  { name: 'Multi-lingual', description: 'Supports multiple languages for wider accessibility' },
  { name: 'Evidence-based', description: 'Recommendations based on latest medical research' },
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
      {/* Background decorations */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className={`mx-auto max-w-2xl lg:mx-0 lg:flex-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex">
            <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 dark:ring-gray-700 hover:ring-gray-900/20 dark:hover:ring-gray-500">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">New</span>
              <span className="h-0.5 w-0.5 rounded-full bg-gray-500" aria-hidden="true" />
              <a href="#" className="flex items-center gap-x-1">
                <span>AI-Powered Image Diagnosis</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            <span className="gradient-text">AI-Powered Healthcare</span> Assistant for Rural Communities
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Empowering healthcare workers with intelligent tools for better diagnosis, triage, and treatment guidance in resource-limited settings.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/symptom-checker"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105"
            >
              Get started
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900 dark:text-white">
                  <div className="absolute left-1 top-1 h-5 w-5 text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {feature.name}
                </dt>
                <dd className="inline ml-1 text-gray-600 dark:text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="relative mx-auto w-[364px] max-w-full">
            {/* Phone frame */}
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-xl ring-1 ring-gray-900/10 dark:ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 opacity-20" />
              <div className="absolute top-0 inset-x-0 h-12 bg-gray-800 flex items-center justify-center">
                <div className="w-28 h-4 rounded-full bg-gray-700" />
              </div>
              <div className="h-[600px] w-full overflow-hidden">
                <div className="h-full w-full bg-white dark:bg-gray-800 p-4">
                  {/* App interface mockup */}
                  <div className="h-full rounded-xl bg-gray-50 dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SwasthyaAI</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-auto">
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                        <h4 className="font-medium text-indigo-800 dark:text-indigo-300">Symptom Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Describe your symptoms or upload an image for diagnosis</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">AI Assistant</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your symptoms, I recommend checking for possible respiratory infection. Would you like me to provide more details?</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-indigo-600 text-white text-sm py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors">Yes, tell me more</button>
                        <button className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm py-2 px-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">No, thanks</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl opacity-70" />
          </div>
        </div>
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-gray-900" />
    </div>
  );
}
