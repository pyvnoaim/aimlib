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
        url: 'https://aimlib.xyz/banner.png',
        width: 1536,
        height: 1024,
        alt: 'AIMLIB | Sounds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Sounds',
    description: 'a sound library by aimers, for aimers',
    images: ['https://aimlib.xyz/banner.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
