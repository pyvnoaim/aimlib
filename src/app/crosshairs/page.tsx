'use client';
import Image from 'next/image';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { LuDownload } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

export default function Crosshairs() {
  const [crosshairs, setCrosshairs] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCrosshairs() {
      const response = await fetch('../api/crosshairs');
      const data = await response.json();
      setCrosshairs(data);
      setLoading(false);
    }
    fetchCrosshairs();
  }, []);

  const filteredCrosshairs = crosshairs.filter((crosshair) => {
    const title = crosshair.replace('.png', '');
    return title.toLowerCase().includes(search.toLowerCase());
  });

  // Skeleton Loader for Image
  const SkeletonImage = () => (
    <div className="w-[80px] h-[80px] bg-gray-600 rounded-full animate-pulse" />
  );

  // Skeleton Loader for Title
  const SkeletonTitle = () => (
    <div className="w-24 h-4 bg-gray-600 rounded-md animate-pulse mt-2" />
  );

  // Skeleton Loader for Download Button
  const SkeletonButton = () => (
    <div className="w-20 h-8 bg-gray-600 rounded-md animate-pulse mt-4" />
  );

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

        <main className="flex-grow flex flex-col transition-all duration-300 mt-5">
          <div className="flex flex-col items-center justify-center h-1/3">
            <h1 className="font-extrabold text-3xl text-center text-white">
              CROSSHAIRS
            </h1>
          </div>

          {/* Search */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-4 py-2 rounded-full border border-purple-500/50 shadow-lg">
              <BiSearch className="text-md" />
              <input
                type="text"
                placeholder="Search crosshairs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-md text-white placeholder-purple-300 w-full"
              />
            </div>
          </div>

          {/* Crosshair Preview Container */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl h-[600px] overflow-y-auto p-4 rounded-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                {loading
                  ? // Render Skeleton UI while loading
                    Array(20)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="group flex flex-col items-center justify-center p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300"
                        >
                          <SkeletonImage />
                          <SkeletonTitle />
                          <SkeletonButton />
                        </div>
                      ))
                  : filteredCrosshairs.map((crosshair, index) => (
                      <div
                        key={index}
                        className="group flex flex-col items-center justify-center p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10 hover:border-purple-400 hover:translate-y-[-5px]"
                      >
                        {/* Crosshair Image Preview */}
                        <Image
                          src={`/crosshairs/${crosshair}`}
                          width={80}
                          height={80}
                          quality={100}
                          alt={crosshair}
                          loader={({ src }) => src}
                          className="w-[80px] h-[80px] transition-transform duration-300 group-hover:scale-125"
                        />

                        {/* Crosshair Title */}
                        <h3 className="text-md md:text-md font-semibold text-center text-white mt-2 truncate">
                          {crosshair.replace('.png', '')}
                        </h3>

                        {/* Crosshair Download Button */}
                        <div className="mt-4 w-full flex justify-center">
                          <a
                            href={`/crosshairs/${crosshair}`}
                            download
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-500/20 text-purple-500 px-2 py-1 rounded-md border border-purple-500/50 shadow-lg hover:border-purple-500"
                          >
                            <LuDownload size={20} />
                          </a>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 px-4 transition-all duration-300">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
