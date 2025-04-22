'use client';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiSolidError, BiSolidHome } from 'react-icons/bi';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="flex-grow h-screen flex flex-col">
        {<Spotlight />}

        <main className="flex-grow flex flex-col transition-all duration-300 items-center justify-center text-center px-4">
          <BiSolidError className="text-6xl text-red-500 mb-4" />
          <h1 className="font-extrabold text-3xl md:text-4xl">
            500 - Server Error
          </h1>
          <p className="text-lg md:text-xl mt-2">
            Something went wrong on our end. Please try again later.
          </p>

          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="flex items-center gap-2 bg-red-500/20 text-red-500 px-6 py-3 rounded-full border border-red-500/50 shadow-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
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
