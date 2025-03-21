// @/components/layouts/sidebar/sidebar.tsx
'use client';

import Link from 'next/link';
import {
  FaHome,
  FaList,
  FaPalette,
  FaMusic,
  FaCrosshairs,
} from 'react-icons/fa';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <div className="group fixed h-screen w-16 bg-zinc-800 p-4 transition-all duration-300 hover:w-64">
      {/* Sidebar Header mit Logo */}
      <div className="flex items-center mb-6">
        {/* Logo */}
        <div className="w-8 h-8 flex-shrink-0">
          <Image
            src="/logo.png" // Pfad zum Logo im public-Ordner
            alt="AIM:LIB Logo"
            width={32}
            height={32}
            className="rounded"
          />
        </div>
        {/* Titel */}
        <div className="text-xl font-bold whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
          AIM:LIB
        </div>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaHome className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/playlists"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaList className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                Playlists
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/themes"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaPalette className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                Themes
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/sounds"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaMusic className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                Sounds
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/crosshairs"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaCrosshairs className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                Crosshairs
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
