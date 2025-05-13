'use client';

import { BiSolidTime } from 'react-icons/bi';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import SettingsTable from '@/components/valorant/SettingsTable';
import valorantSettings from '@/data/valorant-settings.json';
import { ValorantSettings } from '@/types/valorant';

export default function Valorant() {
  return (
    <div className="min-h-screen flex-grow flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 transition-all duration-300 relative overflow-hidden">
      <Spotlight />
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      <div className="flex flex-col items-center justify-center flex-1 py-16 space-y-8 relative z-10">
        <h1 className="font-extrabold text-5xl md:text-6xl text-center text-white">
          VALORANT
        </h1>
        <div className="w-full px-4">
          <SettingsTable settings={valorantSettings as ValorantSettings} />
        </div>
      </div>
      <div className="mt-auto px-6">
        <Footer />
      </div>
    </div>
  );
}
