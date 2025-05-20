'use client';

import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';

export default function Home() {
  return (
    <div className="bg-[#0f172a] min-h-screen">
      <main className="pt-16">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
