"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { detectPneumonia, type PneumoniaDetectionResult } from "@/models/pneumonia/pneumoniaModel";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { motion } from "framer-motion";
import { CloudArrowUpIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function PneumoniaDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PneumoniaDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setResult(null);
    setLoading(true);

    try {
      // Create image element for processing
      const img = document.createElement('img');
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = objectUrl;
      });

      // Validate image dimensions
      if (img.width < 100 || img.height < 100) {
        throw new Error('Image dimensions too small');
      }

      // Create canvas to get ImageData
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Set the image preview
      setImage(objectUrl);

      // Detect pneumonia
      console.log('Starting pneumonia detection...');
      const detectionResult = await detectPneumonia(imageData);
      console.log('Detection result:', detectionResult);
      
      setResult(detectionResult);
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4 text-gray-100">Pneumonia Detection</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Upload a chest X-ray image to detect potential signs of pneumonia using our AI model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  ? "Drop the X-ray image here..."
                  : "Drag & drop a chest X-ray image, or click to select"}
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
                <li>Upload a clear chest X-ray image</li>
                <li>Our AI model analyzes the image for patterns associated with pneumonia</li>
                <li>Review the detection results and probability score</li>
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
                <p className="mt-4 text-gray-300">Analyzing X-ray image...</p>
              </div>
            ) : image ? (
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                  <Image 
                    src={image} 
                    alt="Uploaded X-ray" 
                    fill 
                    className="object-contain"
                  />
                </div>
                
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-100">Detection Result</h3>
                    <div className={`p-5 rounded-lg border ${
                      result.pneumoniaProbability > 0.6 
                        ? 'bg-red-500/20 border-red-500' 
                        : 'bg-green-500/20 border-green-500'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium text-gray-100">
                          {result.pneumoniaProbability > 0.6 
                            ? 'Potential Pneumonia Detected' 
                            : 'No Pneumonia Detected'}
                        </span>
                        <span className={`text-lg font-bold ${
                          result.pneumoniaProbability > 0.6 
                            ? 'text-red-400' 
                            : 'text-green-400'
                        }`}>
                          {Math.round(result.pneumoniaProbability * 100)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            result.pneumoniaProbability > 0.6 
                              ? 'bg-red-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${result.pneumoniaProbability * 100}%` }}
                        ></div>
                      </div>
                      
                      <p className="mt-4 text-gray-300">
                        {result.pneumoniaProbability > 0.6 
                          ? 'The AI model has detected patterns that may indicate pneumonia. Please consult with a healthcare professional for proper diagnosis.' 
                          : 'The AI model did not detect significant patterns associated with pneumonia. However, please consult with a healthcare professional for proper evaluation.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-gray-700 rounded-lg bg-gray-800/30">
                <Image 
                  src="/images/xray-placeholder.png" 
                  alt="X-ray placeholder" 
                  width={300}
                  height={300}
                  className="opacity-50"
                />
                <p className="mt-4 text-gray-400 text-center">
                  Upload an X-ray image to see the analysis results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
