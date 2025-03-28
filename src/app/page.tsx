'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import {
  BiCross,
  BiSolidMusic,
  BiSolidPalette,
  BiSolidTime,
} from 'react-icons/bi';
import { RiPlayList2Fill } from 'react-icons/ri';
import { FiMenu } from 'react-icons/fi';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      title: 'PLAYLISTS',
      description:
        'Aim trainer playlists by popular names to help enhance your aim training experience.',
      icon: <RiPlayList2Fill className="" />,
    },
    {
      title: 'THEMES',
      description:
        'A wide range of themes to personalize and enhance your aim training environment.',
      icon: <BiSolidPalette className="" />,
    },
    {
      title: 'SOUNDS',
      description:
        'A collection of satisfying sounds to make every click more enjoyable.',
      icon: <BiSolidMusic className="" />,
    },
    {
      title: 'CROSSHAIRS',
      description:
        'A diverse range of crosshairs designed to help you find the perfect fit.',
      icon: <BiCross className="" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Sidebar für große Bildschirme */}
      {isMobile ? (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md"
        >
          <FiMenu size={24} />
        </button>
      ) : (
        <Sidebar />
      )}
      {sidebarOpen && <Sidebar />}

      {/* Main Content */}
      <div className="flex-grow min-h-screen flex flex-col">
        {/* Spotlight nur auf großen Bildschirmen */}
        {!isMobile && <Spotlight />}

        {/* Main Content */}
        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center mt-20 md:mt-40 px-4 text-center">
            <h1 className="font-extrabold text-3xl md:text-4xl">AIM:LIB</h1>
            <p className="text-xl md:text-2xl mt-4">
              a library by aimers, for aimers
            </p>
          </div>

          {/* "Coming Soon" Text Section */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-3 py-2 rounded-full border border-purple-500/50 shadow-lg">
              <BiSolidTime className="text-lg" />
              <span className="text-lg">coming soon</span>
            </div>
          </div>

          {/* Centered Grid with Responsive Layout */}
          <div className="flex justify-center mt-10 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/20 hover:border-purple-400 hover:translate-y-[-5px]"
                >
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2 transition-all duration-300 group-hover:text-purple-400">
                    {feature.icon} {feature.title}
                  </h2>
                  <TextGenerateEffect
                    duration={0.8}
                    filter={true}
                    words={feature.description}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto px-4 transition-all duration-300">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
