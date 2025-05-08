import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientSessionWrapper from '@/components/client-session-wrapper';
import { Theme } from '@radix-ui/themes';

const inter = Inter({
  variable: '--font-inter',
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
      <body className={`${inter.variable} antialiased`}>
        <Theme appearance="dark">
          <ClientSessionWrapper>{children}</ClientSessionWrapper>
        </Theme>
      </body>
    </html>
  );
}
