import type { Metadata } from 'next';
import Header from '@/components/layouts/header/header';
import Footer from '@/components/layouts/footer/footer';

export const metadata: Metadata = {
  title: 'AIM:LIB - Themes',
  description: 'AIM:LIB - created by aimers, for aimers',
};

export default function Themes() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Header />
      <h1 className="font-extrabold text-3xl">AIM:LIB - Themes</h1>
      <Footer />
    </div>
  );
}
