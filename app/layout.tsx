import type { Viewport } from 'next';
import NextAbstractWalletProvider from './components/NextAbstractWalletProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  userScalable: true,
  viewportFit: 'auto',
  interactiveWidget: 'resizes-visual',
};

export const metadata = {
  title: 'Koala Koin Toss',
  description: 'A blockchain-based coin flipping game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <NextAbstractWalletProvider>
        <body className="bg-gray-100 text-center min-w-screen">{children}</body>
      </NextAbstractWalletProvider>
    </html>
  );
}
