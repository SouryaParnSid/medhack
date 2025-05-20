'use client';

import Link from 'next/link';
import { 
  CameraIcon, 
  HeartIcon,
  SunIcon
} from '@heroicons/react/24/outline';

// Define the diagnosis options
const diagnosisOptions = [
  {
    id: 'pneumonia',
    name: 'Pneumonia Detection',
    description: 'Detect pneumonia from chest X-ray images using AI.',
    icon: CameraIcon,
    href: '/pneumonia-detection',
    color: 'bg-blue-500',
  },
  {
    id: 'skin-cancer',
    name: 'Skin Cancer Detection',
    description: 'Analyze skin lesions to detect potential skin cancer.',
    icon: SunIcon,
    href: '/skin-cancer-detection',
    color: 'bg-yellow-500',
  },
  {
    id: 'heart',
    name: 'Heart Attack Risk',
    description: 'Analyze cardiac risk factors for heart attack prediction.',
    icon: HeartIcon,
    href: '/heart-attack-prediction',
    color: 'bg-red-500',
  },
  {
    id: 'general',
    name: 'General Medical Image Analysis',
    description: 'Analyze any medical image using our AI assistant.',
    icon: CameraIcon,
    href: '/image-diagnosis/general',
    color: 'bg-purple-500',
  },
];

export default function ImageDiagnosisHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Medical Image Diagnosis</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload medical images for AI-powered analysis and get instant diagnostic assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diagnosisOptions.map((option) => (
            <Link 
              href={option.href} 
              key={option.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`${option.color} h-3 w-full`}></div>
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 mx-auto group-hover:bg-indigo-50 dark:group-hover:bg-gray-600 transition-colors">
                  <option.icon className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {option.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {option.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-indigo-50 dark:bg-gray-800 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li>Select the type of medical image analysis you need</li>
                <li>Upload your medical image (X-ray, MRI, CT scan, etc.)</li>
                <li>Our AI analyzes the image and provides diagnostic insights</li>
                <li>Review the analysis and recommendations</li>
              </ol>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                <CameraIcon className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
