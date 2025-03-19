import type { Metadata } from 'next';
import Header from '@/components/layouts/header/header';

export const metadata: Metadata = {
  title: 'AIM:LIB - Sounds',
  description: 'AIM:LIB - created by aimers, for aimers',
};

export default function Sounds() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Header />
      <h1 className="font-extrabold text-3xl">AIM:LIB - Sounds</h1>
    </div>
  );
}
