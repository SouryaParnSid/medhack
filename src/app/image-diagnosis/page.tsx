'use client';

import { useState, useRef } from 'react';
import { CameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { analyzeMedicalImage } from '@/utils/gemini';

export default function ImageDiagnosis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Image Diagnosis
          </h1>
          <p className="mt-4 text-lg text-gray-500">
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
                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-center">
                  <CameraIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <button
                      type="button"
                      className="relative rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span>Upload a file</span>
                    </button>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={selectedImage}
                    alt="Uploaded image"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white"
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
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                  </div>
                ) : analysis ? (
                  <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-900">Analysis Result</h2>
                    <div className="mt-2 prose prose-sm text-gray-600" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
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
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 