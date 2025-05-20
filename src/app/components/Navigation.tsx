"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  ClipboardDocumentCheckIcon,
  HeartIcon,
  PhotoIcon,
  ArrowPathIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Define the navigation items
const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Symptom Checker', href: '/symptom-checker', icon: ClipboardDocumentCheckIcon },
  { name: 'Triage Assistant', href: '/triage', icon: ArrowPathIcon },
  { name: 'Image Diagnosis', href: '/image-diagnosis', icon: PhotoIcon },
  { name: 'Heart Attack Risk', href: '/heart-attack-prediction', icon: HeartIcon },
  { name: 'Skin Cancer', href: '/skin-cancer-detection', icon: PhotoIcon },
  { name: 'Brain Stroke', href: '/image-diagnosis/brain-stroke', icon: PhotoIcon },
  { name: 'Pneumonia Detection', href: '/pneumonia-detection', icon: PhotoIcon },
  { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon }
];

// Define the main navigation items for mobile bottom bar
const mainNavItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Symptoms', href: '/symptom-checker', icon: ClipboardDocumentCheckIcon },
  { name: 'Diagnosis', href: '/image-diagnosis', icon: PhotoIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon }
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-[#0f172a] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg mr-2">S</div>
            <span className="text-xl font-semibold text-indigo-400">
              SwasthyaAI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme toggle button */}
            <button className="text-gray-300 hover:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Mobile menu button - only visible on larger screens */}
            <button 
              className="md:hidden text-gray-300 hover:text-indigo-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center py-2 px-4 overflow-x-auto">
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-gray-800 absolute z-40 w-full shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center py-2 px-3 rounded-md ${isActive ? 'bg-indigo-900/30 text-indigo-400' : 'text-gray-300 hover:bg-gray-800'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-gray-800 z-50">
        <div className="flex justify-around py-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center text-xs px-3 py-1 ${isActive ? 'text-indigo-400' : 'text-gray-300'}`}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
