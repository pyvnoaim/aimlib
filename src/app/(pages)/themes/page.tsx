'use client';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import { BiSolidTime } from 'react-icons/bi';

export default function Themes() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>
      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-1/3 space-y-6">
            <h1 className="font-extrabold text-3xl text-center text-white">
              THEMES
            </h1>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-2 py-1 rounded-full border border-purple-500/50 shadow-lg">
                <BiSolidTime className="text-md" />
                <span className="text-md">coming soon</span>
              </div>
            </div>
          </div>

          <div className="mt-auto px-6">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
