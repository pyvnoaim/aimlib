import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIMLIB | Dashboard',
  description: 'a library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Dashboard',
    description: 'a library by aimers, for aimers',
    url: 'https://aimlib.xyz/dashboard',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'User dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Dashboard',
    description: 'a library by aimers, for aimers',
    images: ['https://aimlib.xyz/twitter-image.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
