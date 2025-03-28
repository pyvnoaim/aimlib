import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AIM:LIB',
    template: 'AIM:LIB - %s',
  },
  description:
    'The ultimate resource hub for aimers, featuring crosshairs, playlists, themes, and more.',
  keywords: [
    'FPS',
    'Gaming',
    'Shooter',
    'E-Sports',
    'Aim Training',
    'Crosshairs',
    'Playlists',
    'Themes',
    'Sounds',
    'VALORANT',
    'Kovaaks',
    'Aimlabs',
  ],
  authors: [{ name: 'AIM:LIB Team', url: 'https://aimlib.gg' }],
  openGraph: {
    title: 'AIM:LIB',
    description:
      'The ultimate resource hub for aimers, featuring crosshairs, playlists, themes, and more.',
    url: 'https://aimlib.gg',
    siteName: 'AIM:LIB',
    images: [
      {
        url: 'https://aimlib.gg/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AIM:LIB - The Ultimate Aim Resource',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIM:LIB',
    description:
      'The ultimate resource hub for aimers, featuring crosshairs, playlists, themes, and more.',
    site: '@aimlib',
    creator: '@aimlib',
    images: ['https://aimlib.gg/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
