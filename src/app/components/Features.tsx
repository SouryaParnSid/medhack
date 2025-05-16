'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    name: 'Symptom Analysis',
    description: 'Input symptoms via text or voice for AI-powered preliminary diagnosis with high accuracy.',
    href: '/symptom-checker',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    name: 'Smart Triage',
    description: 'Automatically identify and prioritize urgent cases that need immediate medical attention.',
    href: '/triage',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    name: 'Visual Diagnosis',
    description: 'Upload patient images for instant AI analysis of visible conditions with detailed explanations.',
    href: '/image-diagnosis',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    name: 'AI Healthcare Assistant',
    description: 'Get instant guidance on treatments and medication through our intelligent conversational chatbot.',
    href: '/chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div id="features" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Faster diagnosis</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need for better healthcare delivery
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Access powerful AI tools designed to support healthcare workers in resource-limited settings, even with limited internet connectivity.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <button
                key={feature.name}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFeature === index 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-600/20 dark:ring-indigo-400/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => setActiveFeature(index)}
              >
                {feature.name}
              </button>
            ))}
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {/* Feature details */}
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-600/20 text-white">
                  {features[activeFeature].icon}
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {features[activeFeature].name}
                </h3>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  {features[activeFeature].description}
                </p>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Key benefits:</h4>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600 dark:text-gray-400">Reduces diagnostic errors by up to 40%</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600 dark:text-gray-400">Works offline with periodic syncing when internet is available</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600 dark:text-gray-400">Supports multiple languages and dialects for rural communities</p>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-10">
                  <Link
                    href={features[activeFeature].href}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                  >
                    Try {features[activeFeature].name} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Feature visualization */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg">
                <div className="h-full w-full object-cover">
                  {activeFeature === 0 && (
                    <div className="h-full p-6 flex flex-col">
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Symptom Checker</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">1</div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-600 dark:text-gray-400">I have a fever, headache, and sore throat for the past 2 days</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">AI</div>
                            <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-200 dark:border-green-900/30">
                              <p className="text-sm text-gray-700 dark:text-gray-300">Based on your symptoms, you may have an upper respiratory infection. Would you like to know more?</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">2</div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Yes, please tell me more and what should I do?</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 1 && (
                    <div className="h-full p-6 flex flex-col">
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Triage Assistant</h4>
                        <div className="space-y-4">
                          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="font-medium text-red-700 dark:text-red-400">High Priority</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Patient #103</span>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="font-medium text-yellow-700 dark:text-yellow-400">Medium Priority</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Patient #087</span>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-green-700 dark:text-green-400">Low Priority</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Patient #142</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 2 && (
                    <div className="h-full p-6 flex flex-col">
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Image Diagnosis</h4>
                        <div className="space-y-4">
                          <div className="aspect-square max-w-[200px] mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 dark:text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-200 dark:border-indigo-900/30">
                            <p className="text-sm text-gray-700 dark:text-gray-300">Upload an image of the affected area for AI analysis and diagnosis suggestions.</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-indigo-600 text-white text-sm py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors">Upload Image</button>
                            <button className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm py-2 px-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Take Photo</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 3 && (
                    <div className="h-full p-6 flex flex-col">
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">AI Healthcare Assistant</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">AI</div>
                            <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-200 dark:border-green-900/30">
                              <p className="text-sm text-gray-700 dark:text-gray-300">Hello! I'm your AI healthcare assistant. How can I help you today?</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">1</div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-600 dark:text-gray-400">What's the recommended treatment for mild dehydration in children?</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">AI</div>
                            <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-200 dark:border-green-900/30">
                              <p className="text-sm text-gray-700 dark:text-gray-300">For mild dehydration in children, oral rehydration solutions (ORS) are recommended. Small sips frequently is the best approach...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-8 right-8 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />
              <div className="absolute -z-10 bottom-8 left-8 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
