'use client';

import Link from 'next/link';
import {
  FaHome,
  FaList,
  FaPalette,
  FaMusic,
  FaCrosshairs,
} from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="h-screen w-16 bg-zinc-800 p-4 transition-all duration-300 hover:w-64">
      {/* Logo and AIM:LIB Text */}
      <div className="flex items-center mb-6">
        {/* Placeholder Logo */}
        <div className="w-8 h-8 bg-gray-500 rounded-full flex-shrink-0"></div>
        {/* AIM:LIB Text */}
        <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold text-lg">
          AIM:LIB
        </span>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaHome className="w-4 h-4 flex-shrink-0 text-white" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/playlists"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaList className="w-4 h-4 flex-shrink-0 text-white" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                Playlists
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/themes"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaPalette className="w-4 h-4 flex-shrink-0 text-white" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                Themes
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/sounds"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaMusic className="w-4 h-4 flex-shrink-0 text-white" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                Sounds
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/crosshairs"
              className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
            >
              <FaCrosshairs className="w-4 h-4 flex-shrink-0 text-white" />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                Crosshairs
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
