'use client';

import { BiSolidTime } from 'react-icons/bi';
import Footer from '@/components/footer';
import Background from '@/components/background';

export default function Valorant() {
  return (
    <div className="flex flex-grow flex-col min-h-screen bg-zinc-900">
      <Background />
      <div className="flex flex-col items-center justify-center flex-1 py-16 space-y-8 relative z-10">
        <h1 className="font-extrabold text-5xl md:text-6xl text-center text-white">
          VALORANT
        </h1>
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/50 shadow-lg backdrop-blur-sm transition-all duration-300">
            <BiSolidTime className="text-base" />
            <span className="text-base font-medium">coming soon</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
