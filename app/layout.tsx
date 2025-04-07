import type { Viewport } from 'next';
import NextAbstractWalletProvider from './components/NextAbstractWalletProvider';
import './globals.css';

export const viewport: Viewport = {
  width: '1280px',
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
        <body className="bg-[#251639]">{children}</body>
      </NextAbstractWalletProvider>
    </html>
  );
}
