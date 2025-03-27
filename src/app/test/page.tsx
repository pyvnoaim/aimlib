'use client';
import { useState } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';

const TestPage = () => {
  // Add a function name here
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-1/3 mt-10">
            <h1 className="font-extrabold text-3xl text-center">TEST</h1>
          </div>
        </main>
        <div className="mt-auto px-4 transition-all duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TestPage; // Export the component
