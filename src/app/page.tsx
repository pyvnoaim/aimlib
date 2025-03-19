import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIM:LIB',
  description: '...',
};

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="font-extrabold text-3xl">AIM:LIB - Home</h1>
    </div>
  );
}
