'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import {
  FaMusic,
  FaPalette,
  FaList,
  FaCrosshairs,
  FaClock,
} from 'react-icons/fa'; // Imported FaClock for the icon

export default function Home() {
  const features = [
    {
      title: 'Playlists',
      description:
        'Aim trainer playlists by popular names to help enhance your aim training experience.',
      icon: <FaList className="" />,
    },
    {
      title: 'Themes',
      description:
        'A wide range of themes to personalize and enhance your aim training environment.',
      icon: <FaPalette className="" />,
    },
    {
      title: 'Sounds',
      description:
        'A collection of satisfying sound effects to make every click more enjoyable.',
      icon: <FaMusic className="" />,
    },
    {
      title: 'Crosshairs',
      description:
        'A diverse range of crosshairs designed to help you find the perfect fit.',
      icon: <FaCrosshairs className="" />,
    },
  ];

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

        {/* Main Content */}
        <main className="flex-grow flex flex-col transition-all duration-300">
          {/* Centered Title and Subtitle */}
          <div className="flex flex-col items-center justify-center h-1/3 mt-10">
            {' '}
            {/* Added mt-10 to move down */}
            <h1 className="font-extrabold text-3xl text-center mt-40">
              AIM:LIB
            </h1>
            <p className="text-center text-xl mt-4">
              {' '}
              a library by aimers, for aimers
            </p>
          </div>

          {/* "Coming Soon" Text Section */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-2 py-1 rounded-full border-1 border-purple-500/50 shadow-lg">
              <FaClock className="text-md" />
              <span className="text-md">coming soon</span>
            </div>
          </div>

          {/* Centered 2x2 Grid Containers with more space */}
          <div className="flex justify-center mt-10">
            {' '}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10 hover:border-purple-400"
                >
                  <h2 className="font-bold text-xl mb-2 flex items-center gap-2 transition-all duration-300 group-hover:text-purple-400 group-hover:scale-105">
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
