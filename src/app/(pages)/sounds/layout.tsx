import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIM:LIB | Sounds',
  description: 'a sound library by aimers, for aimers',
  openGraph: {
    title: 'AIM:LIB | Sounds',
    description: 'a sound library by aimers, for aimers',
    url: 'https://aimlib.xyz/sounds',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Sounds Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIM:LIB | Sounds',
    description: 'a sound library by aimers, for aimers',
    images: ['https://aimlib.xyz/twitter-image.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
