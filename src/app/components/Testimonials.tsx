'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    content: "SwasthyaAI has transformed how we provide healthcare in our rural clinic. The AI diagnosis suggestions are remarkably accurate and have helped us treat patients more effectively with limited resources.",
    author: {
      name: "Dr. Priya Sharma",
      role: "Medical Officer, Rural Health Center",
      imageUrl: "/testimonials/doctor1.jpg",
    },
  },
  {
    content: "As a community health worker with basic training, this tool gives me confidence in identifying serious conditions that need immediate referral. The offline mode is essential in our area with limited connectivity.",
    author: {
      name: "Rajesh Kumar",
      role: "Community Health Worker",
      imageUrl: "/testimonials/chw1.jpg",
    },
  },
  {
    content: "The image diagnosis feature has been invaluable for skin conditions and wounds assessment. It provides treatment recommendations that are evidence-based and appropriate for our setting.",
    author: {
      name: "Dr. Ananya Patel",
      role: "Physician, District Hospital",
      imageUrl: "/testimonials/doctor2.jpg",
    },
  },
];

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Pause rotation on hover
  const pauseRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Resume rotation on mouse leave
  const resumeRotation = () => {
    intervalRef.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600 dark:text-indigo-400">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trusted by healthcare professionals across rural communities
          </p>
        </div>
        
        <div 
          className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none"
          onMouseEnter={pauseRotation}
          onMouseLeave={resumeRotation}
        >
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`relative pt-8 sm:inline-block sm:w-full sm:px-4 transition-all duration-500 ${activeTestimonial === index ? 'opacity-100 scale-100' : 'opacity-50 scale-95 hover:opacity-80'}`}
                onClick={() => setActiveTestimonial(index)}
              >
                <figure className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 text-sm leading-6 h-full cursor-pointer hover:shadow-md transition-shadow">
                  <blockquote className="text-gray-900 dark:text-gray-200">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="relative h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      {testimonial.author.imageUrl ? (
                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author.name}</div>
                      <div className="text-gray-600 dark:text-gray-400">{testimonial.author.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
          
          {/* Testimonial navigation dots */}
          <div className="mt-10 flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`h-2 w-2 rounded-full ${activeTestimonial === index ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-gray-300 dark:bg-gray-700'}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
