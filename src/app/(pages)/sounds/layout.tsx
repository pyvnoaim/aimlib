import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIMLIB | Sounds',
  description: 'a sound library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Sounds',
    description: 'a sound library by aimers, for aimers',
    url: 'https://aimlib.xyz/sounds',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.png',
        width: 1200,
        height: 630,
        alt: 'AIMLIB | Sounds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Sounds',
    description: 'a sound library by aimers, for aimers',
    images: ['https://aimlib.xyz/logo.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
