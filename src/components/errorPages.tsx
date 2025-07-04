'use client';

import { BiSolidError, BiSolidHome } from 'react-icons/bi';
import Link from 'next/link';
import Background from '@/components/background';

type ErrorPageProps = {
  code: '401' | '403' | '404' | '500';
  title: string;
  description: string;
};

export default function ErrorPage({
  code,
  title,
  description,
}: ErrorPageProps) {
  const getErrorColor = (code: string) => {
    switch (code) {
      case '401':
        return 'blue';
      case '403':
        return 'yellow';
      case '404':
        return 'red';
      case '500':
        return 'red';
      default:
        return 'red';
    }
  };

  const color = getErrorColor(code);

  return (
    <div className="flex flex-grow flex-col min-h-screen bg-zinc-900 text-white">
      <Background />

      <main className="flex-grow flex flex-col transition-all duration-300 items-center justify-center text-center px-4 z-10">
        <BiSolidError className={`text-6xl text-${color}-500 mb-4`} />
        <h1 className="font-extrabold text-3xl md:text-4xl">
          {code} - {title}
        </h1>
        <p className="text-lg md:text-xl mt-2">{description}</p>

        <div className="flex justify-center mt-6">
          <Link
            href="/"
            className={`flex items-center gap-2 bg-${color}-500/20 text-${color}-500 px-6 py-3 rounded-full border border-${color}-500/50 shadow-lg hover:bg-${color}-500/30 transition-all duration-300 hover:scale-110`}
          >
            <BiSolidHome className="text-lg" />
            <span className="text-md md:text-lg">Back to Home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
