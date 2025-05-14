'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BiCross,
  BiSolidMusic,
  BiSolidPalette,
  BiSolidHome,
} from 'react-icons/bi';
import { SiValorant } from 'react-icons/si';
import { RiPlayList2Fill } from 'react-icons/ri';
import LoginButton from '@/components/login-button';
import { Avatar } from '@radix-ui/themes';

export default function Sidebar() {
  const currentPath = usePathname();

  const isActive = (path: string) =>
    currentPath === path
      ? 'text-purple-400 transition-all duration-300'
      : 'text-white';

  return (
    <div className="h-screen w-16 bg-zinc-800 p-4 transition-all duration-300 hover:w-64 flex flex-col justify-between border border-zinc-700">
      <div>
        <Link
          href="/"
          className="relative flex items-center mb-6 hover:bg-zinc-700 rounded-lg transition-all duration-300"
        >
          <Avatar
            src="/logo.png"
            alt="Logo"
            fallback="A"
            size="2"
            radius="large"
            color="gray"
            variant="solid"
          />
          <div className="absolute inset-x-0 text-center">
            <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold text-lg">
              AIM:LIB
            </span>
          </div>
        </Link>

        <hr className="border-zinc-700 my-4" />

        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/playlists"
                className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
              >
                <RiPlayList2Fill
                  className={`w-4 h-4 flex-shrink-0 ${isActive('/playlists')}`}
                />
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
                <BiSolidPalette
                  className={`w-4 h-4 flex-shrink-0 ${isActive('/themes')}`}
                />
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
                <BiSolidMusic
                  className={`w-4 h-4 flex-shrink-0 ${isActive('/sounds')}`}
                />
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
                <BiCross
                  className={`w-4 h-4 flex-shrink-0 ${isActive('/crosshairs')}`}
                />
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
                <SiValorant
                  className={`w-4 h-4 flex-shrink-0 ${isActive('/valorant')}`}
                />
                <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                  Valorant
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <LoginButton />
    </div>
  );
}
