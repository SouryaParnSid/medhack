'use client';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />
      
      <main className="pt-16">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}
