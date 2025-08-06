'use client';
import Link from 'next/link';
import Footer from '@/components/footer';
import {
  BiCross,
  BiSolidMusic,
  BiSolidPalette,
  BiLineChart,
} from 'react-icons/bi';
import { IoLibrary } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { SiValorant } from 'react-icons/si';
import { motion } from 'framer-motion';
import Background from '@/components/background';

export default function Home() {
  const features = [
    {
      title: 'BENCHMARKS',
      description:
        'Aim training benchmarks to track and improve your performance.',
      icon: <BiLineChart className="text-xl" />,
      href: '/benchmarks',
      badge: 'coming soon',
    },
    {
      title: 'CROSSHAIRS',
      description:
        'A diverse range of crosshairs designed to help you find the perfect fit.',
      icon: <BiCross className="text-xl" />,
      href: '/crosshairs',
      badge: 'coming soon',
    },
    {
      title: 'PLAYLISTS',
      description:
        'Aim trainer playlists to help enhance your aim training experience.',
      icon: <RiPlayList2Fill className="text-xl" />,
      href: '/playlists',
    },
    {
      title: 'SOUNDS',
      description:
        'A collection of satisfying sounds to make every click more enjoyable.',
      icon: <BiSolidMusic className="text-xl" />,
      href: '/sounds',
      badge: 'coming soon',
    },
    {
      title: 'THEMES',
      description:
        'A wide range of themes to personalize and enhance your aim training environment.',
      icon: <BiSolidPalette className="text-xl" />,
      href: '/themes',
      badge: 'coming soon',
    },
    {
      title: 'VALORANT',
      description:
        'Valorant-specific resources and settings to improve your gameplay.',
      icon: <SiValorant className="text-xl" />,
      href: '/valorant',
      badge: 'coming soon',
    },
  ];

  return (
    <div className="min-h-screen flex-grow flex flex-col bg-zinc-900 transition-all duration-300 text-white">
      <Background />
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center justify-center space-y-8 mb-12"
        >
          <div className="relative">
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="font-extrabold text-5xl md:text-6xl text-center text-white "
            >
              AIMLIB
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center text-zinc-400 mt-4 text-lg"
            >
              Elevate your aim training with curated resources
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center gap-4"
          >
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/50 shadow-lg backdrop-blur-sm transition-all duration-300">
              <IoLibrary className="text-base" />
              <span className="text-base font-medium">
                a library by aimers, for aimers
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="relative flex justify-center"
        >
          <motion.div
            layout
            className="flex flex-col gap-6 p-4 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.slice(0, 4).map((feature, index) => (
                <Link key={index} href={feature.href}>
                  <motion.div
                    layout
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.3,
                    }}
                    className="group p-6 rounded-xl shadow-2xl bg-zinc-800 transition-all duration-300 hover:bg-zinc-700 border border-zinc-700 hover:scale-105 hover:border-purple-500 hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-bold text-lg flex items-center gap-3 transition-all duration-300 group-hover:text-purple-400">
                        {feature.icon} {feature.title}
                      </h2>
                      {feature.badge && (
                        <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">
                      {feature.description}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.slice(4, 6).map((feature, index) => (
                <Link key={index + 4} href={feature.href}>
                  <motion.div
                    layout
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.3,
                    }}
                    className="group p-6 rounded-xl shadow-2xl bg-zinc-800 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-700 border border-zinc-700 hover:scale-105 hover:border-purple-500 hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-bold text-lg flex items-center gap-3 transition-all duration-300 group-hover:text-purple-400">
                        {feature.icon} {feature.title}
                      </h2>
                      {feature.badge && (
                        <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">
                      {feature.description}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
