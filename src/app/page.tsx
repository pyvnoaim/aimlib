'use client';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import { TextGenerateEffect } from '@/components/text-generate-effect';
import { BiCross, BiSolidMusic, BiSolidPalette } from 'react-icons/bi';
import { IoLibrary } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      title: 'PLAYLISTS',
      description:
        'Aim trainer playlists to help enhance your aim training experience.',
      icon: <RiPlayList2Fill className="text-xl" />,
      href: '/playlists',
    },
    {
      title: 'THEMES',
      description:
        'A wide range of themes to personalize and enhance your aim training environment.',
      icon: <BiSolidPalette className="text-xl" />,
      href: '/themes',
    },
    {
      title: 'SOUNDS',
      description:
        'A collection of satisfying sounds to make every click more enjoyable.',
      icon: <BiSolidMusic className="text-xl" />,
      href: '/sounds',
    },
    {
      title: 'CROSSHAIRS',
      description:
        'A diverse range of crosshairs designed to help you find the perfect fit.',
      icon: <BiCross className="text-xl" />,
      href: '/crosshairs',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex-grow flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 transition-all duration-300 relative overflow-hidden">
      <Spotlight />
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      <div className="flex-1 flex flex-col items-center justify-center py-12">
        {/* Hero Section */}
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
              className="font-extrabold text-5xl md:text-6xl text-center text-white"
            >
              AIMLIB
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/50 shadow-lg backdrop-blur-sm transition-all duration-300">
              <IoLibrary className="text-base" />
              <span className="text-base font-medium">
                a library by aimers, for aimers
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative flex justify-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 p-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="group p-6 rounded-xl shadow-2xl bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-700/50 border border-zinc-700/50"
                >
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-3 transition-all duration-300 group-hover:text-purple-400">
                    {feature.icon} {feature.title}
                  </h2>
                  <TextGenerateEffect
                    duration={0.8}
                    filter={true}
                    words={feature.description}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-auto px-6">
        <Footer />
      </div>
    </div>
  );
}
