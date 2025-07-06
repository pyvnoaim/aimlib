import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIMLIB | Playlists',
  description: 'a playlist library by aimers, for aimers',
  openGraph: {
    title: 'AIMLIB | Playlists',
    description: 'a playlist library by aimers, for aimers',
    url: 'https://aimlib.xyz/playlists',
    type: 'website',
    images: [
      {
        url: 'https://aimlib.xyz/banner.png',
        width: 1536,
        height: 1024,
        alt: 'AIMLIB | Playlists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pyvnoaim',
    title: 'AIMLIB | Playlists',
    description: 'a playlist library by aimers, for aimers',
    images: ['https://aimlib.xyz/banner.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
