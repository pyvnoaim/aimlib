'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { BiCross, BiSolidMusic, BiSolidPalette } from 'react-icons/bi';
import { IoLibrary } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';

export default function Home() {
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
      {/* Sidebar */}
      <div className="group">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow h-auto flex flex-col">
        {/* Spotlight */}
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-1/3">
            <h1 className="font-extrabold text-3xl md:text-4xl text-center text-white mt-80">
              AIM:LIB
            </h1>
            <div className="flex justify-center mt-5 sm:mt-8">
              <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-2 py-1 rounded-full border-1 border-purple-500/50 shadow-lg">
                <IoLibrary className="text-md" />
                <span className="text-md">a library by aimers, for aimers</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="flex justify-center mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 p-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10 hover:border-purple-400 hover:scale-105"
                >
                  <h2 className="font-bold text-md mb-2 flex items-center gap-2 transition-all duration-300 group-hover:text-purple-400">
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
