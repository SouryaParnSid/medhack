"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  ClipboardDocumentCheckIcon,
  HeartIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Define the navigation items to match the screenshot exactly
const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Symptom Checker', href: '/symptom-checker', icon: ClipboardDocumentCheckIcon },
  { name: 'Triage Assistant', href: '/triage', icon: ArrowPathIcon },
  { name: 'Image Diagnosis', href: '/image-diagnosis', icon: PhotoIcon },
  { name: 'Heart Attack Risk', href: '/heart-attack-prediction', icon: HeartIcon },
  { name: 'Skin Cancer', href: '/skin-cancer-detection', icon: PhotoIcon },
  { name: 'Pneumonia Detection', href: '/pneumonia-detection', icon: PhotoIcon },
  { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="bg-[#0f172a] border-b border-gray-800">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg mr-2">S</div>
          <span className="text-xl font-semibold text-indigo-400">
            SwasthyaAI
          </span>
        </div>
        
        <div className="flex items-center">
          <button className="text-gray-300 hover:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Navigation with icons */}
      <div className="flex justify-center py-2 px-4">
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center text-xs ${isActive ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'}`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
