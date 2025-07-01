import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';
import Providers from './providers';

const bricolage_grotesque = Bricolage_Grotesque({
  variable: '--font',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AIMLIB | Home',
  description: 'a library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Home',
    description: 'a library by aimers, for aimers',
    url: 'https://aimlib.xyz',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.png',
        alt: 'AIMLIB | Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Home',
    description: 'a library by aimers, for aimers',
    images: ['https://aimlib.xyz/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage_grotesque.variable} antialiased dark`}>
        <Providers>
          <div className="flex min-h-screen">
            <div className="group relative z-10">
              <Sidebar />
            </div>
            <main className="flex-1 flex flex-col min-h-screen">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
