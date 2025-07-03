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
        url: 'https://aimlib.xyz/banner.png',
        width: 1536,
        height: 1024,
        alt: 'AIMLIB | Crosshairs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Crosshairs',
    description: 'a crosshair library by aimers, for aimers',
    images: ['https://aimlib.xyz/banner.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
