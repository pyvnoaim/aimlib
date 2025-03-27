'use client';

import Link from 'next/link';
import {
  BiCross,
  BiSolidMusic,
  BiSolidPalette,
  BiSolidHome,
} from 'react-icons/bi';
import { SiValorant } from 'react-icons/si';
import { RiPlayList2Fill } from 'react-icons/ri';
import { FiLogIn } from 'react-icons/fi';

export default function Sidebar() {
  return (
    <div className="h-screen w-16 bg-zinc-800 p-4 transition-all duration-300 hover:w-64 flex flex-col justify-between">
      {/* Logo und AIM:LIB Text */}
      <div>
        <div className="relative flex items-center mb-6">
          {/* Placeholder Logo */}
          <div className="w-8 h-8 bg-gray-500 rounded-full flex-shrink-0"></div>
          <div className="absolute inset-x-0 text-center">
            <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold text-lg">
              AIM:LIB
            </span>
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
                <BiSolidHome className="w-4 h-4 flex-shrink-0 text-white" />
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
                <RiPlayList2Fill className="w-4 h-4 flex-shrink-0 text-white" />
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
                <BiSolidPalette className="w-4 h-4 flex-shrink-0 text-white" />
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
                <BiSolidMusic className="w-4 h-4 flex-shrink-0 text-white" />
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
                <BiCross className="w-4 h-4 flex-shrink-0 text-white" />
                <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                  Crosshairs
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/valorant"
                className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
              >
                <SiValorant className="w-4 h-4 flex-shrink-0 text-white" />
                <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                  Valorant
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sign In Link */}
      <div>
        <Link
          href=""
          className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
        >
          <FiLogIn className="w-4 h-4 flex-shrink-0 text-white" />
          <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
}
