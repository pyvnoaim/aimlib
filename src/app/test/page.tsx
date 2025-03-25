'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { LuDownload } from 'react-icons/lu';

export default function Home() {
  const [crosshairs, setCrosshairs] = useState<string[]>([]);
  const [filteredCrosshairs, setFilteredCrosshairs] =
    useState<string[]>(crosshairs);
  const placeholders = [
    'Search the crosshair database...',
    'Dot...',
    'Cross...',
    'Zeeq...',
  ];

  // Handle input change in the search bar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    // Filter crosshairs based on the search query
    const filtered = crosshairs.filter((crosshair) =>
      crosshair.toLowerCase().includes(query)
    );
    setFilteredCrosshairs(filtered);
  };

  // Handle submit: Reset the filter to show all crosshairs
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilteredCrosshairs(crosshairs); // Reset to show all crosshairs
    console.log('submitted');
  };

  useEffect(() => {
    async function fetchCrosshairs() {
      const response = await fetch('../api/crosshairs');
      const data = await response.json();
      setCrosshairs(data);
      setFilteredCrosshairs(data); // Initially set filteredCrosshairs to all crosshairs
    }

    fetchCrosshairs();
  }, []);

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

          <div className="px-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange} //
              onSubmit={onSubmit}
            />
          </div>

          {/* Crosshair Preview Container */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl h-[650px] overflow-y-auto p-4 rounded-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                {filteredCrosshairs.map((crosshair, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center justify-center p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10 hover:border-purple-400"
                  >
                    {/* Crosshair Image Preview */}
                    <Image
                      src={`/crosshairs/${crosshair}`}
                      width={100}
                      height={100}
                      quality={100}
                      alt={crosshair}
                      loader={({ src }) => src}
                      className="w-[80px] h-[80px] object-contain transition-transform duration-300 group-hover:scale-125"
                    />

                    {/* Crosshair Title */}
                    <h3 className="text-lg font-semibold text-center text-white mt-2">
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
