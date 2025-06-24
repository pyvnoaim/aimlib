import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIMLIB | Valorant',
  description: 'a valorant library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Valorant',
    description: 'a valorant library by aimers, for aimers',
    url: 'https://aimlib.xyz/valorant',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Valorant Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Valorant',
    description: 'a valorant library by aimers, for aimers',
    images: ['https://aimlib.xyz/twitter-image.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
