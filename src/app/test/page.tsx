'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { LuDownload } from 'react-icons/lu';

export default function Test() {
  const crosshairs = Array.from({ length: 20 }, (_, i) => ({
    title: `test${i + 1}`,
    src: 'ZeeqPlus2.png',
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Sidebar */}
      <div className="group">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow h-screen flex flex-col">
        {/* Spotlight */}
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-1/3 mt-10">
            <h1 className="font-extrabold text-3xl text-center text-white">
              CROSS:HAIRS
            </h1>
          </div>

          {/* Crosshair Preview Container */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl h-[600px] overflow-y-auto p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                {crosshairs.map((crosshair, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center justify-center p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10 hover:border-purple-400"
                  >
                    {/* Image Preview with hover effect */}
                    <img
                      src={crosshair.src}
                      alt={crosshair.title}
                      className="w-24 h-24 object-contain mb-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Title with Download Icon */}
                    <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-center text-white">
                        {crosshair.title}
                      </h3>
                      <a
                        href={crosshair.src}
                        download
                        className="bg-purple-500/20 text-purple-500 px-2 py-1 rounded-md border border-purple-500/50 shadow-lg hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300"
                      >
                        <LuDownload size={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with extra space */}
          <div className="mt-12 px-4 transition-all duration-300">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
