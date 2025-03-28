'use client';

import { useState, useEffect } from 'react';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiSolidError, BiSolidHome } from 'react-icons/bi';
import Link from 'next/link';

export default function NotFound() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Main Content */}
      <div className="flex-grow h-screen flex flex-col">
        {/* Spotlight nur auf großen Bildschirmen */}
        {!isMobile && <Spotlight />}

        {/* Main Content */}
        <main className="flex-grow flex flex-col transition-all duration-300 items-center justify-center text-center px-4">
          <BiSolidError className="text-6xl text-red-500 mb-4" />
          <h1 className="font-extrabold text-3xl md:text-4xl">
            404 - Page Not Found
          </h1>
          <p className="text-lg md:text-xl mt-2">
            Oops! The page you are looking for does not exist.
          </p>

          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-6 py-3 rounded-full border border-purple-500/50 shadow-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
            >
              <BiSolidHome className="text-lg" />
              <span className="text-md md:text-lg">Back to Home</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
