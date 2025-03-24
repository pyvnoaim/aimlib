'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { FaMusic, FaPalette, FaList, FaCrosshairs } from 'react-icons/fa';

export default function Home() {
  const features = [
    {
      title: 'Playlists',
      description:
        'A library of playlists created by well known names to help you improve your aim.',
      icon: <FaList className="" />,
    },
    {
      title: 'Themes',
      description:
        'A library of themes to customize your aimtraining experience to your liking.',
      icon: <FaPalette className="" />,
    },
    {
      title: 'Sounds',
      description:
        'A library of sounds to make those clicks feel more satisfying.',
      icon: <FaMusic className="" />,
    },
    {
      title: 'Crosshairs',
      description:
        'A library of crosshairs so you can have the perfect crosshair for every scenario.',
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
            <h1 className="font-extrabold text-5xl text-center mt-40">
              AIM:LIB
            </h1>
            <p className="text-center text-xl mt-4">
              {' '}
              {/* Increased mt-4 for more space */}a library by aimers, for
              aimers.
            </p>
          </div>

          {/* Centered 2x2 Grid Containers with more space */}
          <div className="flex justify-center mt-10">
            {' '}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10"
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
