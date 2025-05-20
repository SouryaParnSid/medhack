"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { detectPneumonia, type PneumoniaDetectionResult } from "@/models/pneumonia/pneumoniaModel";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw image with proper orientation
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Get prediction
        const detectionResult = await detectPneumonia(imageData);
        setResult(detectionResult);
        setImage(objectUrl);
      } catch (error) {
        throw new Error(`Failed to process image data: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing image';
      setError(`${errorMessage}. Please try again.`);
      console.error('Image processing error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    },
    multiple: false
  });

  // Helper function to get severity color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "Severe":
        return "text-red-600 dark:text-red-400";
      case "Moderate":
        return "text-orange-600 dark:text-orange-400";
      case "Mild":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Pneumonia Detection
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a chest X-ray image for AI-powered pneumonia analysis
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-12
                transition-colors duration-200 ease-in-out
                ${isDragActive 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"}
              `}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <CloudArrowUpIcon className={`
                  w-12 h-12 mx-auto mb-4
                  ${isDragActive ? "text-blue-500" : "text-gray-400"}
                `} />
                <p className="text-xl mb-2 font-medium text-gray-900 dark:text-white">
                  {isDragActive
                    ? "Drop the chest X-ray image here"
                    : "Drag and drop a chest X-ray image"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to select from your computer
                </p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Supports PNG, JPG, JPEG
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <LoadingSpinner />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Analyzing X-ray image...
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8"
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-800 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {result && image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* X-ray Image */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    X-ray Image
                  </h3>
                  <div className="relative aspect-square bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt="Uploaded X-ray"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Analysis Results
                    </h3>

                    {/* Diagnosis */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg mb-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Diagnosis
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className={`text-2xl font-bold ${getSeverityColor(result.details.severity)}`}>
                          {result.prediction}
                          {result.details.severity && (
                            <span className="ml-2 text-base font-normal">
                              ({result.details.severity})
                            </span>
                          )}
                        </p>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Confidence
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {(result.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* X-ray Findings */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        X-ray Findings
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(result.details)
                          .filter(([key]) => key !== 'severity')
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                            >
                              {String(value)}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Recommendations
                      </h4>
                      <div className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg text-sm
                              ${rec.includes("IMMEDIATE") || rec.includes("⚠️")
                                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                : "bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300"}
                            `}
                          >
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
