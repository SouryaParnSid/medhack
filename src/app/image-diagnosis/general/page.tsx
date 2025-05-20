"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { motion } from "framer-motion";
import { CloudArrowUpIcon, ExclamationTriangleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { analyzeMedicalImage } from "@/utils/gemini";

export default function GeneralMedicalImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisHtml, setAnalysisHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Reset states
    setError(null);
    setAnalysisHtml(null);
    setLoading(true);

    try {
      // Convert the file to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
      });
      
      reader.readAsDataURL(file);
      const base64Image = await base64Promise;
      
      // Set the image preview
      setImage(base64Image);
      
      // Use Gemini API to analyze the image
      console.log('Starting Gemini image analysis...');
      const analysisResult = await analyzeMedicalImage(base64Image);
      console.log('Gemini analysis received');
      
      // Set the HTML analysis result
      setAnalysisHtml(analysisResult);
      
      // Scroll to the analysis result after it's rendered
      setTimeout(() => {
        if (analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-100">General Medical Image Analysis</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Upload any medical image for AI-powered analysis and get instant diagnostic assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-indigo-400 bg-indigo-50/5' 
                  : 'border-gray-600 hover:border-indigo-400 hover:bg-indigo-50/5'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-300">
                {isDragActive
                  ? "Drop the medical image here..."
                  : "Drag & drop a medical image, or click to select"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Supported formats: JPEG, PNG, GIF
              </p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-500">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-100">How It Works</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li>Upload any medical image (X-ray, MRI, CT scan, etc.)</li>
                <li>Our AI model analyzes the image for patterns and abnormalities</li>
                <li>Review the analysis results, findings, and recommendations</li>
                <li>Consult with a healthcare professional for proper diagnosis</li>
              </ol>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Disclaimer:</strong> This tool is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-300">Analyzing medical image...</p>
              </div>
            ) : image ? (
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                  <Image 
                    src={image} 
                    alt="Uploaded medical image" 
                    fill 
                    className="object-contain"
                  />
                </div>
                
                {analysisHtml && (
                  <motion.div 
                    className="mt-6 md:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    ref={analysisRef}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-center mb-3 md:mb-4">
                        <DocumentTextIcon className="h-5 w-5 md:h-6 md:w-6 text-indigo-500 mr-2" />
                        <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">Analysis Results</h3>
                      </div>
                      <div 
                        className="prose prose-sm md:prose-base prose-indigo dark:prose-invert max-w-none text-sm md:text-base" 
                        dangerouslySetInnerHTML={{ __html: analysisHtml }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-gray-700 rounded-lg bg-gray-800/30">
                <DocumentTextIcon className="w-16 h-16 text-gray-500" />
                <p className="mt-4 text-gray-400 text-center">
                  Upload a medical image to see the analysis results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
