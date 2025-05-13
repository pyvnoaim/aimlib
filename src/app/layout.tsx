import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import ClientSessionWrapper from '@/components/client-session-wrapper';
import { Theme } from '@radix-ui/themes';
import { Spotlight } from '@/components/spotlight-new';
import Sidebar from '@/components/sidebar';

const rubik = Rubik({
  variable: '--font',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AIM:LIB',
  description: 'a library by aimers, for aimers',
  openGraph: {
    title: 'AIM:LIB',
    description: 'a library by aimers, for aimers',
    url: 'https://aimlib.xyz',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'AIM:LIB Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIM:LIB',
    description: 'a library by aimers, for aimers',
    images: ['https://aimlib.xyz/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} antialiased`}>
        <Theme appearance="dark">
          <ClientSessionWrapper>
            <div className="flex min-h-screen">
              <div className="group relative z-10">
                <Sidebar />
              </div>
              <main className="flex-1 flex flex-col min-h-screen">
                {children}
              </main>
            </div>
          </ClientSessionWrapper>
        </Theme>
      </body>
    </html>
  );
}
