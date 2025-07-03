import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIMLIB | Themes',
  description: 'a theme library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Themes',
    description: 'a theme library by aimers, for aimers',
    url: 'https://aimlib.xyz/themes',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/banner.png',
        width: 1536,
        height: 1024,
        alt: 'AIMLIB | Themes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Themes',
    description: 'a theme library by aimers, for aimers',
    images: ['https://aimlib.xyz/banner.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
