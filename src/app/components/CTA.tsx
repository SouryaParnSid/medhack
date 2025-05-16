'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <div className="bg-indigo-600 dark:bg-indigo-900">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform healthcare delivery?
            <br />
            Start using SwasthyaAI today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
            Join healthcare professionals across rural communities who are using AI to improve patient outcomes and provide better care with limited resources.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/symptom-checker"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
            >
              Get started
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
