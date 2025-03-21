'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import { Spotlight } from '@/components/ui/spotlight-new';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Spotlight />
        <main className="flex-grow flex items-center justify-center">
          <h1 className="font-extrabold text-3xl">AIM:LIB - Home</h1>
        </main>
      </div>
    </div>
  );
}
