'use client';

import { BiSolidTime } from 'react-icons/bi';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';

export default function Sounds() {
  return (
    <div className="min-h-screen flex-grow flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 transition-all duration-300 relative overflow-hidden">
      <Spotlight />
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      <div className="flex flex-col items-center justify-center flex-1 py-32 space-y-6 relative z-10">
        <h1 className="font-extrabold text-5xl md:text-6xl text-center text-white ">
          SOUNDS
        </h1>
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/50 shadow-lg backdrop-blur-sm transition-all duration-300">
            <BiSolidTime className="text-base" />
            <span className="text-base font-medium">coming soon</span>
          </div>
        </div>
      </div>
      <div className="mt-auto px-6">
        <Footer />
      </div>
    </div>
  );
}
