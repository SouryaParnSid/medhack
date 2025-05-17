'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { analyzeMedicalImage } from '@/utils/gemini';

export default function ImageDiagnosis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference on component mount
  useEffect(() => {
    // Check if user prefers dark mode
    if (typeof window !== 'undefined') {
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkModePreference);
      
      // Add listener for changes in color scheme preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        analyzeImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsLoading(true);
    try {
      const result = await analyzeMedicalImage(imageData);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysis('Sorry, there was an error analyzing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        analyzeImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} py-24`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
            Image Diagnosis
          </h1>
          <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Upload an image for AI-powered analysis and preliminary diagnosis.
          </p>

          <div className="mt-8">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {!selectedImage ? (
              <div
                className={`mt-2 flex justify-center rounded-lg border border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-900/25'} px-6 py-10 ${isDarkMode ? 'bg-gray-800/50' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-center">
                  <CameraIcon className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <div className={`mt-4 flex text-sm leading-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <button
                      type="button"
                      className={`relative rounded-md ${isDarkMode ? 'bg-gray-700 text-indigo-400 hover:text-indigo-300 focus-within:ring-indigo-500' : 'bg-white text-indigo-600 hover:text-indigo-500 focus-within:ring-indigo-600'} font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span>Upload a file</span>
                    </button>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className={`text-xs leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className={`relative aspect-[16/9] overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-lg`}>
                  <Image
                    src={selectedImage}
                    alt="Selected medical image"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    width={500}
                    height={300}
                  />
                  <button
                    type="button"
                    className={`absolute top-2 right-2 rounded-full ${isDarkMode ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' : 'bg-white/80 text-gray-600 hover:bg-white'} p-2 transition-colors duration-200`}
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysis(null);
                    }}
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center">
                    <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid ${isDarkMode ? 'border-indigo-400' : 'border-indigo-600'} border-r-transparent`}></div>
                  </div>
                ) : analysis ? (
                  <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow'} p-6 transition-colors duration-200`}>
                    <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis Result</h2>
                    <div className={`mt-2 prose prose-sm ${isDarkMode ? 'text-gray-300 prose-invert' : 'text-gray-600'}`} dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
                    <div className="mt-4 flex flex-wrap gap-4">
                      <button
                        type="button"
                        className={`rounded-md ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500'} px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200`}
                      >
                        Save to Records
                      </button>
                      <button
                        type="button"
                        className={`rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200 ring-gray-600 hover:bg-gray-600' : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'} px-3.5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset transition-colors duration-200`}
                      >
                        Share with Doctor
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 