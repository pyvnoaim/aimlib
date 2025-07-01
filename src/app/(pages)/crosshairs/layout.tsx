import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIMLIB | Crosshairs',
  description: 'a crosshair library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Crosshairs',
    description: 'a crosshair library by aimers, for aimers',
    url: 'https://aimlib.xyz/crosshairs',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/logo.png',
        width: 1200,
        height: 630,
        alt: 'AIMLIB | Crosshairs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Crosshairs',
    description: 'a crosshair library by aimers, for aimers',
    images: ['https://aimlib.xyz/logo.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
