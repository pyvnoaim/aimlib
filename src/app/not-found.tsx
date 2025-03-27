'use client';

import { Spotlight } from '@/components/ui/spotlight-new';
import { BiSolidError, BiSolidHome } from 'react-icons/bi';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Main Content */}
      <div className="flex-grow h-screen flex flex-col">
        {/* Spotlight */}
        <Spotlight />

        {/* Main Content */}
        <main className="flex-grow flex flex-col transition-all duration-300 items-center justify-center text-center">
          <BiSolidError className="text-6xl text-red-500 mb-4" />
          <h1 className="font-extrabold text-3xl">404 - Page Not Found</h1>
          <p className="text-lg mt-2">
            Oops! The page you are looking for does not exist.
          </p>

          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-4 py-2 rounded-full border border-purple-500/50 shadow-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
            >
              <BiSolidHome className="text-lg" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
